import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createHmac, createHash } from 'crypto';
import { WebhookLog } from './entities/webhook-log.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { CredentixPaymentService } from './credentix-payment.service';

interface AdyenNotificationItem {
  NotificationRequestItem: {
    pspReference: string;
    originalReference?: string;
    merchantReference: string;
    eventCode: string;
    success: string;
    reason?: string;
    amount: { value: number; currency: string };
    additionalData?: Record<string, string>;
  };
}

interface AdyenWebhookPayload {
  live: string;
  notificationItems: AdyenNotificationItem[];
}

const EVENT_STATUS_MAP: Record<
  string,
  { success: PaymentStatus; failure?: PaymentStatus }
> = {
  AUTHORISATION: {
    success: PaymentStatus.AUTHORIZED,
    failure: PaymentStatus.REFUSED,
  },
  CAPTURE: { success: PaymentStatus.CAPTURED, failure: PaymentStatus.FAILED },
  CANCELLATION: { success: PaymentStatus.CANCELED },
  REFUND: { success: PaymentStatus.CAPTURED },
  CAPTURE_FAILED: { success: PaymentStatus.FAILED },
};

@Injectable()
export class WebhookProcessor {
  private readonly logger = new Logger(WebhookProcessor.name);
  private readonly hmacKey: string;
  private readonly captureDelayHours: number;

  constructor(
    @InjectRepository(WebhookLog)
    private readonly webhookLogRepo: Repository<WebhookLog>,
    private readonly paymentService: CredentixPaymentService,
    private readonly config: ConfigService,
  ) {
    this.hmacKey = this.config.get<string>('ADYEN_WEBHOOK_HMAC_KEY', '');
    this.captureDelayHours = this.config.get<number>('CAPTURE_DELAY_HOURS', 0);
  }

  verifyHmac(payload: string, hmacSignature: string): boolean {
    if (!this.hmacKey) {
      this.logger.warn('HMAC key not configured, skipping verification');
      return true;
    }

    const computed = createHmac('sha256', Buffer.from(this.hmacKey, 'hex'))
      .update(payload, 'utf8')
      .digest('base64');

    return computed === hmacSignature;
  }

  async processWebhook(
    rawPayload: string,
    hmacSignature?: string,
  ): Promise<{ accepted: boolean }> {
    if (hmacSignature && !this.verifyHmac(rawPayload, hmacSignature)) {
      throw new UnauthorizedException('Invalid HMAC signature');
    }

    const body: AdyenWebhookPayload = JSON.parse(rawPayload);

    for (const item of body.notificationItems) {
      const notification = item.NotificationRequestItem;
      await this.processNotification(notification);
    }

    return { accepted: true };
  }

  private async processNotification(
    notification: AdyenNotificationItem['NotificationRequestItem'],
  ): Promise<void> {
    const {
      pspReference,
      originalReference,
      eventCode,
      success,
      merchantReference,
      reason,
    } = notification;
    const isSuccess = success === 'true';

    const idempotencyHash = this.computeHash(pspReference, eventCode, success);

    const existing = await this.webhookLogRepo.findOne({
      where: { rawPayloadHash: idempotencyHash },
    });

    if (existing) {
      this.logger.log(
        `Duplicate webhook skipped: ${eventCode} for psp=${this.maskRef(pspReference)}`,
      );
      return;
    }

    const log = this.webhookLogRepo.create({
      rawPayloadHash: idempotencyHash,
      pspReference,
      eventCode,
      success: isSuccess,
    });

    try {
      let payment = await this.paymentService.findByPspReference(pspReference);

      if (!payment && originalReference) {
        payment =
          await this.paymentService.findByPspReference(originalReference);
      }
      if (!payment) {
        payment =
          await this.paymentService.findByMerchantReference(merchantReference);
      }

      if (!payment) {
        this.logger.warn(
          `Payment not found for psp=${this.maskRef(pspReference)}, originalRef=${originalReference ? this.maskRef(originalReference) : 'n/a'}, merchantRef=${merchantReference}`,
        );
        log.errorMessage = 'Payment not found';
        log.processedAt = new Date();
        await this.webhookLogRepo.save(log);
        return;
      }

      if (!payment.pspReference && pspReference) {
        await this.paymentService.updatePspReference(payment.id, pspReference);
        payment.pspReference = pspReference;
      }

      const newStatus = this.mapEventToStatus(eventCode, isSuccess);
      if (!newStatus) {
        this.logger.warn(`Unmapped event code: ${eventCode}`);
        log.processedAt = new Date();
        await this.webhookLogRepo.save(log);
        return;
      }

      await this.paymentService.transitionStatus(
        payment,
        newStatus,
        'WEBHOOK',
        {
          eventCode,
          pspReference: this.maskRef(pspReference),
          success: isSuccess,
          reason: reason ?? null,
        },
      );

      if (!isSuccess && reason) {
        payment.failureReason = reason;
      }

      log.processedAt = new Date();
      await this.webhookLogRepo.save(log);

      this.logger.log(
        `Webhook processed: ${eventCode} → ${newStatus} for psp=${this.maskRef(pspReference)}`,
      );
    } catch (error) {
      log.errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      log.processedAt = new Date();
      await this.webhookLogRepo.save(log);

      this.logger.error(
        `Webhook processing failed for ${eventCode} psp=${this.maskRef(pspReference)}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private mapEventToStatus(
    eventCode: string,
    isSuccess: boolean,
  ): PaymentStatus | null {
    const mapping = EVENT_STATUS_MAP[eventCode];
    if (!mapping) return null;

    if (!isSuccess) return mapping.failure ?? null;

    if (eventCode === 'AUTHORISATION' && this.captureDelayHours === 0) {
      return PaymentStatus.CAPTURED;
    }

    return mapping.success;
  }

  computeHash(
    pspReference: string,
    eventCode: string,
    success: string,
  ): string {
    const raw = `${pspReference}:${eventCode}:${success}`;
    return createHash('sha256').update(raw).digest('hex');
  }

  private maskRef(ref: string): string {
    if (ref.length <= 4) return '****';
    return ref.slice(0, -4) + '****';
  }
}

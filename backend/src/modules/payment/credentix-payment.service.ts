import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Payment } from './entities/payment.entity';
import { PaymentEvent } from './entities/payment-event.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { PaymentStateMachine } from './payment-state-machine';
import { AdyenService } from './adyen.service';
import { PaymentCapturedEvent } from '../../common/events/payment-captured.event';
import { CREDIT_BUNDLES, BundleId } from '../../../config/constants';

@Injectable()
export class CredentixPaymentService {
  private readonly logger = new Logger(CredentixPaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(PaymentEvent)
    private readonly paymentEventRepo: Repository<PaymentEvent>,
    private readonly adyenService: AdyenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async initiatePayment(userId: string, bundleId: BundleId, returnUrl: string) {
    const bundle = CREDIT_BUNDLES[bundleId];
    const merchantReference = `CRX-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const idempotencyKey = randomUUID();

    const payment = this.paymentRepo.create({
      userId,
      merchantReference,
      amountMinor: bundle.amountMinor,
      currency: 'USD',
      status: PaymentStatus.INITIATED,
      idempotencyKey,
      metadata: { bundleId },
    });

    const saved = await this.paymentRepo.save(payment);

    await this.recordEvent(saved.id, null, PaymentStatus.INITIATED, 'API');

    try {
      const session = await this.adyenService.createSession({
        amountMinor: bundle.amountMinor,
        currency: 'USD',
        merchantReference,
        shopperReference: userId,
        returnUrl,
        idempotencyKey,
      });

      return {
        paymentId: saved.id,
        merchantReference,
        sessionId: session.sessionId,
        sessionData: session.sessionData,
        clientKey: this.adyenService.getClientKey(),
        environment: this.adyenService.getEnvironment(),
      };
    } catch (error) {
      this.logger.error(
        `Adyen session creation failed for ref=${merchantReference}`,
        error instanceof Error ? error.stack : String(error),
      );

      await this.transitionStatus(saved, PaymentStatus.ERROR, 'API', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  async transitionStatus(
    payment: Payment,
    newStatus: PaymentStatus,
    source: string,
    payload?: Record<string, unknown>,
  ): Promise<Payment> {
    PaymentStateMachine.assertTransition(payment.status, newStatus);

    const fromStatus = payment.status;
    payment.status = newStatus;

    if (newStatus === PaymentStatus.AUTHORIZED) {
      payment.authorizedAt = new Date();
    }
    if (newStatus === PaymentStatus.CAPTURED) {
      payment.capturedAt = new Date();
    }

    const updated = await this.paymentRepo.save(payment);
    await this.recordEvent(payment.id, fromStatus, newStatus, source, payload);

    this.logger.log(
      `Payment ${payment.id}: ${fromStatus} → ${newStatus} [${source}]`,
    );

    if (newStatus === PaymentStatus.CAPTURED) {
      this.eventEmitter.emit(
        PaymentCapturedEvent.EVENT_NAME,
        new PaymentCapturedEvent(updated),
      );
    }

    return updated;
  }

  async findById(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }
    return payment;
  }

  async findByPspReference(pspReference: string): Promise<Payment | null> {
    return this.paymentRepo.findOne({ where: { pspReference } });
  }

  async findByMerchantReference(
    merchantReference: string,
  ): Promise<Payment | null> {
    return this.paymentRepo.findOne({ where: { merchantReference } });
  }

  async updatePspReference(
    paymentId: string,
    pspReference: string,
  ): Promise<void> {
    await this.paymentRepo.update(paymentId, { pspReference });
  }

  async findUserPayments(userId: string): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  private async recordEvent(
    paymentId: string,
    fromStatus: PaymentStatus | null,
    toStatus: PaymentStatus,
    source: string,
    payload?: Record<string, unknown>,
  ): Promise<void> {
    const event = this.paymentEventRepo.create({
      paymentId,
      fromStatus,
      toStatus,
      eventSource: source,
      eventPayload: payload ?? null,
    });
    await this.paymentEventRepo.save(event);
  }
}

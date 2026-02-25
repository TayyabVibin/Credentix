import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WalletService } from './wallet.service';
import { PaymentCapturedEvent } from '../../common/events/payment-captured.event';

@Injectable()
export class WalletEventListener {
  private readonly logger = new Logger(WalletEventListener.name);

  constructor(private readonly walletService: WalletService) {}

  @OnEvent(PaymentCapturedEvent.EVENT_NAME)
  async handlePaymentCaptured(event: PaymentCapturedEvent): Promise<void> {
    this.logger.log(
      `Received payment.captured event for payment ${event.payment.id}`,
    );

    const entry = await this.walletService.allocateCredits(event.payment);

    if (entry) {
      this.logger.log(
        `Credits allocated: +${entry.credits} → balance ${entry.balanceAfter}`,
      );
    }
  }
}

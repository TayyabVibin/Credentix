import { Payment } from '../../modules/payment/entities/payment.entity';

export class PaymentCapturedEvent {
  static readonly EVENT_NAME = 'payment.captured';

  constructor(public readonly payment: Payment) {}
}

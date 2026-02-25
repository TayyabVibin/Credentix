import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { Payment } from '../entities/payment.entity';

export class PaymentResponseDto {
  id!: string;
  merchantReference!: string;
  amountMinor!: number;
  currency!: string;
  status!: PaymentStatus;
  createdAt!: Date;
  authorizedAt!: Date | null;
  capturedAt!: Date | null;
  failureReason!: string | null;

  static fromEntity(payment: Payment): PaymentResponseDto {
    const dto = new PaymentResponseDto();
    dto.id = payment.id;
    dto.merchantReference = payment.merchantReference;
    dto.amountMinor = payment.amountMinor;
    dto.currency = payment.currency;
    dto.status = payment.status;
    dto.createdAt = payment.createdAt;
    dto.authorizedAt = payment.authorizedAt;
    dto.capturedAt = payment.capturedAt;
    dto.failureReason = payment.failureReason;
    return dto;
  }
}

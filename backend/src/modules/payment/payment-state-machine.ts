import { BadRequestException } from '@nestjs/common';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

const VALID_TRANSITIONS: Record<string, PaymentStatus[]> = {
  [PaymentStatus.INITIATED]: [
    PaymentStatus.AUTHORIZED,
    PaymentStatus.FAILED,
    PaymentStatus.REFUSED,
    PaymentStatus.CANCELED,
    PaymentStatus.PENDING,
    PaymentStatus.ERROR,
  ],
  [PaymentStatus.AUTHORIZED]: [
    PaymentStatus.CAPTURED,
    PaymentStatus.FAILED,
    PaymentStatus.CANCELED,
  ],
  [PaymentStatus.PENDING]: [
    PaymentStatus.AUTHORIZED,
    PaymentStatus.CAPTURED,
    PaymentStatus.FAILED,
    PaymentStatus.REFUSED,
    PaymentStatus.CANCELED,
    PaymentStatus.ERROR,
  ],
};

const TERMINAL_STATES: Set<PaymentStatus> = new Set([
  PaymentStatus.CAPTURED,
  PaymentStatus.FAILED,
  PaymentStatus.CANCELED,
  PaymentStatus.REFUSED,
  PaymentStatus.ERROR,
]);

export class PaymentStateMachine {
  static isTerminal(status: PaymentStatus): boolean {
    return TERMINAL_STATES.has(status);
  }

  static canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
    const allowed = VALID_TRANSITIONS[from];
    if (!allowed) return false;
    return allowed.includes(to);
  }

  static assertTransition(from: PaymentStatus, to: PaymentStatus): void {
    if (!PaymentStateMachine.canTransition(from, to)) {
      throw new BadRequestException(
        `Invalid payment state transition: ${from} → ${to}`,
      );
    }
  }

  static getAllowedTransitions(from: PaymentStatus): PaymentStatus[] {
    return VALID_TRANSITIONS[from] ?? [];
  }
}

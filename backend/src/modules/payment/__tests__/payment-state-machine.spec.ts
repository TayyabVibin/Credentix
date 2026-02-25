import { PaymentStateMachine } from '../payment-state-machine';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';

describe('PaymentStateMachine', () => {
  describe('valid transitions from INITIATED', () => {
    const validTargets = [
      PaymentStatus.AUTHORIZED,
      PaymentStatus.FAILED,
      PaymentStatus.REFUSED,
      PaymentStatus.CANCELED,
      PaymentStatus.PENDING,
      PaymentStatus.ERROR,
    ];

    it.each(validTargets)('INITIATED → %s should be allowed', (target) => {
      expect(
        PaymentStateMachine.canTransition(PaymentStatus.INITIATED, target),
      ).toBe(true);
      expect(() =>
        PaymentStateMachine.assertTransition(PaymentStatus.INITIATED, target),
      ).not.toThrow();
    });
  });

  describe('valid transitions from AUTHORIZED', () => {
    const validTargets = [
      PaymentStatus.CAPTURED,
      PaymentStatus.FAILED,
      PaymentStatus.CANCELED,
    ];

    it.each(validTargets)('AUTHORIZED → %s should be allowed', (target) => {
      expect(
        PaymentStateMachine.canTransition(PaymentStatus.AUTHORIZED, target),
      ).toBe(true);
    });
  });

  describe('valid transitions from PENDING', () => {
    const validTargets = [
      PaymentStatus.AUTHORIZED,
      PaymentStatus.CAPTURED,
      PaymentStatus.FAILED,
      PaymentStatus.REFUSED,
      PaymentStatus.CANCELED,
      PaymentStatus.ERROR,
    ];

    it.each(validTargets)('PENDING → %s should be allowed', (target) => {
      expect(
        PaymentStateMachine.canTransition(PaymentStatus.PENDING, target),
      ).toBe(true);
    });
  });

  describe('terminal states cannot transition', () => {
    const terminalStates = [
      PaymentStatus.CAPTURED,
      PaymentStatus.FAILED,
      PaymentStatus.CANCELED,
      PaymentStatus.REFUSED,
      PaymentStatus.ERROR,
    ];

    const allStatuses = Object.values(PaymentStatus);

    it.each(terminalStates)('%s is identified as terminal', (status) => {
      expect(PaymentStateMachine.isTerminal(status)).toBe(true);
    });

    for (const terminal of terminalStates) {
      it.each(allStatuses)(`${terminal} → %s should be rejected`, (target) => {
        expect(PaymentStateMachine.canTransition(terminal, target)).toBe(false);
      });
    }
  });

  describe('invalid transitions throw', () => {
    it('INITIATED → CAPTURED should throw', () => {
      expect(() =>
        PaymentStateMachine.assertTransition(
          PaymentStatus.INITIATED,
          PaymentStatus.CAPTURED,
        ),
      ).toThrow('Invalid payment state transition');
    });

    it('AUTHORIZED → AUTHORIZED should throw', () => {
      expect(() =>
        PaymentStateMachine.assertTransition(
          PaymentStatus.AUTHORIZED,
          PaymentStatus.AUTHORIZED,
        ),
      ).toThrow('Invalid payment state transition');
    });

    it('AUTHORIZED → INITIATED should throw', () => {
      expect(() =>
        PaymentStateMachine.assertTransition(
          PaymentStatus.AUTHORIZED,
          PaymentStatus.INITIATED,
        ),
      ).toThrow('Invalid payment state transition');
    });
  });

  describe('non-terminal states', () => {
    it('INITIATED is not terminal', () => {
      expect(PaymentStateMachine.isTerminal(PaymentStatus.INITIATED)).toBe(
        false,
      );
    });

    it('AUTHORIZED is not terminal', () => {
      expect(PaymentStateMachine.isTerminal(PaymentStatus.AUTHORIZED)).toBe(
        false,
      );
    });

    it('PENDING is not terminal', () => {
      expect(PaymentStateMachine.isTerminal(PaymentStatus.PENDING)).toBe(false);
    });
  });

  describe('getAllowedTransitions', () => {
    it('returns allowed transitions for INITIATED', () => {
      const allowed = PaymentStateMachine.getAllowedTransitions(
        PaymentStatus.INITIATED,
      );
      expect(allowed).toContain(PaymentStatus.AUTHORIZED);
      expect(allowed).not.toContain(PaymentStatus.CAPTURED);
    });

    it('returns empty array for terminal states', () => {
      expect(
        PaymentStateMachine.getAllowedTransitions(PaymentStatus.CAPTURED),
      ).toEqual([]);
    });
  });
});

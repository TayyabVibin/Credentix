import { WalletEventListener } from '../wallet-event.listener';
import { WalletService } from '../wallet.service';
import { PaymentCapturedEvent } from '../../../common/events/payment-captured.event';
import { Payment } from '../../payment/entities/payment.entity';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';

describe('WalletEventListener', () => {
  let listener: WalletEventListener;
  let mockWalletService: { allocateCredits: jest.Mock };

  beforeEach(() => {
    mockWalletService = {
      allocateCredits: jest.fn(),
    };
    listener = new WalletEventListener(
      mockWalletService as unknown as WalletService,
    );
  });

  it('calls allocateCredits when payment.captured event fires', async () => {
    const payment = {
      id: 'pay-1',
      userId: 'user-1',
      status: PaymentStatus.CAPTURED,
      amountMinor: 1000,
      metadata: { bundleId: 'bundle_10' },
    } as Payment;

    mockWalletService.allocateCredits.mockResolvedValue({
      credits: 100,
      balanceAfter: 100,
    });

    const event = new PaymentCapturedEvent(payment);
    await listener.handlePaymentCaptured(event);

    expect(mockWalletService.allocateCredits).toHaveBeenCalledWith(payment);
  });

  it('handles null return (duplicate) gracefully', async () => {
    const payment = { id: 'pay-2' } as Payment;
    mockWalletService.allocateCredits.mockResolvedValue(null);

    const event = new PaymentCapturedEvent(payment);
    await expect(
      listener.handlePaymentCaptured(event),
    ).resolves.toBeUndefined();
  });
});

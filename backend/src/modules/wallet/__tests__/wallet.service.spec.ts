import { WalletService } from '../wallet.service';
import { LedgerEntry } from '../entities/ledger-entry.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';

describe('WalletService', () => {
  let walletService: WalletService;
  let mockLedgerRepo: {
    findOne: jest.Mock;
    find: jest.Mock;
    findAndCount: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(() => {
    mockLedgerRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn((data) => ({ ...data })),
      save: jest.fn((entity) => Promise.resolve({ id: 'ledger-1', ...entity })),
    };

    walletService = new WalletService(mockLedgerRepo as any);
  });

  describe('getBalance', () => {
    it('returns 0 when no ledger entries exist', async () => {
      mockLedgerRepo.findOne.mockResolvedValue(null);
      const balance = await walletService.getBalance('user-1');
      expect(balance).toBe(0);
    });

    it('returns balance from most recent entry', async () => {
      mockLedgerRepo.findOne.mockResolvedValue({ balanceAfter: 300 });
      const balance = await walletService.getBalance('user-1');
      expect(balance).toBe(300);
    });
  });

  describe('allocateCredits', () => {
    function makePayment(overrides: Partial<Payment> = {}): Payment {
      return {
        id: 'pay-1',
        userId: 'user-1',
        amountMinor: 1000,
        currency: 'USD',
        status: PaymentStatus.CAPTURED,
        metadata: { bundleId: 'bundle_10' },
        merchantReference: 'CRX-123',
        pspReference: 'PSP-123',
        idempotencyKey: 'idem-1',
        paymentMethodType: null,
        failureReason: null,
        authorizedAt: null,
        capturedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        events: [],
        user: {} as any,
        ...overrides,
      };
    }

    it('allocates credits for bundle_10 (100 credits)', async () => {
      mockLedgerRepo.findOne.mockResolvedValueOnce(null); // no existing allocation
      mockLedgerRepo.findOne.mockResolvedValueOnce(null); // balance = 0

      const payment = makePayment();
      const result = await walletService.allocateCredits(payment);

      expect(result).not.toBeNull();
      expect(mockLedgerRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ credits: 100, balanceAfter: 100 }),
      );
    });

    it('allocates credits for bundle_25 (300 credits)', async () => {
      mockLedgerRepo.findOne.mockResolvedValueOnce(null);
      mockLedgerRepo.findOne.mockResolvedValueOnce(null);

      const payment = makePayment({
        amountMinor: 2500,
        metadata: { bundleId: 'bundle_25' },
      });
      await walletService.allocateCredits(payment);

      expect(mockLedgerRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ credits: 300 }),
      );
    });

    it('allocates credits for bundle_50 (750 credits)', async () => {
      mockLedgerRepo.findOne.mockResolvedValueOnce(null);
      mockLedgerRepo.findOne.mockResolvedValueOnce(null);

      const payment = makePayment({
        amountMinor: 5000,
        metadata: { bundleId: 'bundle_50' },
      });
      await walletService.allocateCredits(payment);

      expect(mockLedgerRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ credits: 750 }),
      );
    });

    it('adds credits to existing balance', async () => {
      mockLedgerRepo.findOne.mockResolvedValueOnce(null); // no existing allocation
      mockLedgerRepo.findOne.mockResolvedValueOnce({ balanceAfter: 200 }); // existing balance

      const payment = makePayment();
      await walletService.allocateCredits(payment);

      expect(mockLedgerRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ credits: 100, balanceAfter: 300 }),
      );
    });

    it('returns null for duplicate allocation (application-level check)', async () => {
      mockLedgerRepo.findOne.mockResolvedValueOnce({ id: 'existing' });

      const payment = makePayment();
      const result = await walletService.allocateCredits(payment);

      expect(result).toBeNull();
      expect(mockLedgerRepo.save).not.toHaveBeenCalled();
    });

    it('returns null for duplicate allocation (DB constraint)', async () => {
      mockLedgerRepo.findOne.mockResolvedValueOnce(null);
      mockLedgerRepo.findOne.mockResolvedValueOnce(null);
      mockLedgerRepo.save.mockRejectedValueOnce({ code: '23505' });

      const payment = makePayment();
      const result = await walletService.allocateCredits(payment);

      expect(result).toBeNull();
    });

    it('falls back to amount-based mapping when bundleId is missing', async () => {
      mockLedgerRepo.findOne.mockResolvedValueOnce(null);
      mockLedgerRepo.findOne.mockResolvedValueOnce(null);

      const payment = makePayment({ metadata: {} });
      await walletService.allocateCredits(payment);

      // 1000 minor units -> 100 credits via amount mapping (matches bundle_10)
      expect(mockLedgerRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ credits: 100 }),
      );
    });
  });

  describe('getTransactions', () => {
    it('returns paginated results', async () => {
      const mockEntries = [
        { id: '1', credits: 100, balanceAfter: 100, createdAt: new Date() },
      ];
      mockLedgerRepo.findAndCount.mockResolvedValue([mockEntries, 1]);

      const result = await walletService.getTransactions('user-1', 1, 20);

      expect(result.entries).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pages).toBe(1);
    });
  });
});

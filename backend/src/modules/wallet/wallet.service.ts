import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LedgerEntry } from './entities/ledger-entry.entity';
import { Payment } from '../payment/entities/payment.entity';
import { CREDIT_BUNDLES, BundleId } from '../../../config/constants';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectRepository(LedgerEntry)
    private readonly ledgerRepo: Repository<LedgerEntry>,
  ) {}

  async getBalance(userId: string): Promise<number> {
    const lastEntry = await this.ledgerRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return lastEntry?.balanceAfter ?? 0;
  }

  async getRecentEntries(userId: string, limit = 5): Promise<LedgerEntry[]> {
    return this.ledgerRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getTransactions(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    entries: LedgerEntry[];
    total: number;
    page: number;
    pages: number;
  }> {
    const [entries, total] = await this.ledgerRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['payment'],
    });

    return {
      entries,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Allocate credits for a captured payment.
   * Idempotent: UNIQUE constraint on payment_id prevents double allocation.
   */
  async allocateCredits(payment: Payment): Promise<LedgerEntry | null> {
    const existing = await this.ledgerRepo.findOne({
      where: { paymentId: payment.id },
    });

    if (existing) {
      this.logger.log(
        `Credits already allocated for payment ${payment.id}, skipping`,
      );
      return null;
    }

    const bundleId = (payment.metadata as Record<string, string>)?.bundleId as
      | BundleId
      | undefined;
    let credits: number;

    if (bundleId && CREDIT_BUNDLES[bundleId]) {
      credits = CREDIT_BUNDLES[bundleId].credits;
    } else {
      credits = this.mapAmountToCredits(payment.amountMinor);
    }

    const currentBalance = await this.getBalance(payment.userId);
    const newBalance = currentBalance + credits;

    const entry = this.ledgerRepo.create({
      userId: payment.userId,
      paymentId: payment.id,
      credits,
      balanceAfter: newBalance,
    });

    try {
      const saved = await this.ledgerRepo.save(entry);
      this.logger.log(
        `Allocated ${credits} credits to user ${payment.userId} (balance: ${newBalance}) for payment ${payment.id}`,
      );
      return saved;
    } catch (error: unknown) {
      const dbError = error as { code?: string };
      if (dbError.code === '23505') {
        this.logger.log(
          `Duplicate allocation attempt caught by DB constraint for payment ${payment.id}`,
        );
        return null;
      }
      throw error;
    }
  }

  private mapAmountToCredits(amountMinor: number): number {
    for (const bundle of Object.values(CREDIT_BUNDLES)) {
      if (bundle.amountMinor === amountMinor) {
        return bundle.credits;
      }
    }
    return Math.floor(amountMinor / 10);
  }
}

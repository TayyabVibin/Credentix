import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { AdminMetricsDto } from './dto/admin-metrics.dto';

@Injectable()
export class AdminMetricsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async getMetrics(): Promise<AdminMetricsDto> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const qb = this.paymentRepo
      .createQueryBuilder('p')
      .where('p.created_at >= :since', { since: sevenDaysAgo });

    const allPayments = await qb.getMany();

    const captured = allPayments.filter(
      (p) => p.status === PaymentStatus.CAPTURED,
    );
    const authorized = allPayments.filter(
      (p) => p.status === PaymentStatus.AUTHORIZED,
    );
    const pending = allPayments.filter(
      (p) => p.status === PaymentStatus.PENDING,
    );
    const nonPending = allPayments.filter(
      (p) => p.status !== PaymentStatus.PENDING,
    );

    const totalVolume7d = captured.reduce((sum, p) => sum + p.amountMinor, 0);

    const successRate =
      nonPending.length > 0 ? (captured.length / nonPending.length) * 100 : 0;

    const dailyMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      dailyMap.set(d.toISOString().slice(0, 10), 0);
    }

    for (const p of captured) {
      const key = p.createdAt.toISOString().slice(0, 10);
      if (dailyMap.has(key)) {
        dailyMap.set(key, (dailyMap.get(key) ?? 0) + p.amountMinor);
      }
    }

    const dailyVolume = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, amountMinor]) => ({ date, amountMinor }));

    return {
      dailyVolume,
      totalVolume7d,
      successRate,
      pendingCount: pending.length,
      authorizedCount: authorized.length,
      capturedCount: captured.length,
    };
  }
}

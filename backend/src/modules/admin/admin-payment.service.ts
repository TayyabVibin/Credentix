import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ILike } from 'typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import {
  AdminPaymentListItemDto,
  AdminPaymentDetailDto,
  AdminPaymentEventDto,
} from './dto/admin-payment.dto';

export interface AdminPaymentsQuery {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  currency?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable()
export class AdminPaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async listPayments(query: AdminPaymentsQuery): Promise<{
    payments: AdminPaymentListItemDto[];
    total: number;
    page: number;
    pages: number;
  }> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 20));
    const skip = (page - 1) * limit;

    const qb = this.paymentRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .orderBy('p.created_at', 'DESC');

    if (query.status) {
      qb.andWhere('p.status = :status', { status: query.status });
    }
    if (query.currency) {
      qb.andWhere('p.currency = :currency', { currency: query.currency });
    }
    if (query.search) {
      qb.andWhere(
        '(p.merchant_reference ILIKE :search OR p.psp_reference ILIKE :search OR u.email ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }
    if (query.dateFrom) {
      qb.andWhere('p.created_at >= :dateFrom', {
        dateFrom: new Date(query.dateFrom),
      });
    }
    if (query.dateTo) {
      qb.andWhere('p.created_at <= :dateTo', {
        dateTo: new Date(query.dateTo),
      });
    }

    const [payments, total] = await qb.skip(skip).take(limit).getManyAndCount();

    const items: AdminPaymentListItemDto[] = payments.map((p) => ({
      id: p.id,
      userId: p.userId,
      userEmail: (p.user as { email?: string })?.email ?? '',
      merchantReference: p.merchantReference,
      pspReference: p.pspReference,
      amountMinor: p.amountMinor,
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    }));

    return {
      payments: items,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    };
  }

  async getPaymentDetail(id: string): Promise<AdminPaymentDetailDto | null> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['user', 'events'],
      order: { events: { createdAt: 'ASC' } },
    });

    if (!payment) return null;

    const events: AdminPaymentEventDto[] = (payment.events ?? []).map((e) => ({
      id: e.id,
      fromStatus: e.fromStatus,
      toStatus: e.toStatus,
      eventSource: e.eventSource,
      createdAt: e.createdAt.toISOString(),
    }));

    return {
      id: payment.id,
      userId: payment.userId,
      userEmail: (payment.user as { email?: string })?.email ?? '',
      merchantReference: payment.merchantReference,
      pspReference: payment.pspReference,
      amountMinor: payment.amountMinor,
      currency: payment.currency,
      status: payment.status,
      createdAt: payment.createdAt.toISOString(),
      paymentMethodType: payment.paymentMethodType,
      failureReason: payment.failureReason,
      authorizedAt: payment.authorizedAt?.toISOString() ?? null,
      capturedAt: payment.capturedAt?.toISOString() ?? null,
      events,
    };
  }
}

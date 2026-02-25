import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookLog } from '../payment/entities/webhook-log.entity';
import { AdminWebhookLogDto } from './dto/admin-webhook.dto';

@Injectable()
export class AdminWebhookService {
  constructor(
    @InjectRepository(WebhookLog)
    private readonly webhookRepo: Repository<WebhookLog>,
  ) {}

  async listWebhooks(
    page = 1,
    limit = 20,
  ): Promise<{
    logs: AdminWebhookLogDto[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    const [logs, total] = await this.webhookRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const items: AdminWebhookLogDto[] = logs.map((l) => ({
      id: l.id,
      pspReference: l.pspReference,
      eventCode: l.eventCode,
      success: l.success,
      processedAt: l.processedAt?.toISOString() ?? null,
      errorMessage: l.errorMessage,
      createdAt: l.createdAt.toISOString(),
    }));

    return {
      logs: items,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    };
  }
}

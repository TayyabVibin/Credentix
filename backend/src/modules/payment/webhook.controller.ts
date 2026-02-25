import { Controller, Post, Headers, Req, HttpCode } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { WebhookProcessor } from './webhook.processor';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookProcessor: WebhookProcessor) {}

  @Post('adyen')
  @HttpCode(200)
  async handleAdyenWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('hmac-signature') hmacSignature?: string,
  ): Promise<string> {
    const rawBody = req.rawBody?.toString('utf-8') ?? JSON.stringify(req.body);

    await this.webhookProcessor.processWebhook(rawBody, hmacSignature);

    return '[accepted]';
  }
}

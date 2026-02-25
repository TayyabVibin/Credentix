import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { WebhookLog } from '../payment/entities/webhook-log.entity';
import { UserModule } from '../user/user.module';
import { AdminPaymentService } from './admin-payment.service';
import { AdminMetricsService } from './admin-metrics.service';
import { AdminWebhookService } from './admin-webhook.service';
import { AdminSeedService } from './admin-seed.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, WebhookLog]), UserModule],
  controllers: [AdminController],
  providers: [
    AdminPaymentService,
    AdminMetricsService,
    AdminWebhookService,
    AdminSeedService,
  ],
  exports: [],
})
export class AdminModule {}

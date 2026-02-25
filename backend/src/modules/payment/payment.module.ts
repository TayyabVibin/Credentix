import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentEvent } from './entities/payment-event.entity';
import { WebhookLog } from './entities/webhook-log.entity';
import { AdyenService } from './adyen.service';
import { CredentixPaymentService } from './credentix-payment.service';
import { WebhookProcessor } from './webhook.processor';
import { PaymentController } from './payment.controller';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, PaymentEvent, WebhookLog])],
  controllers: [PaymentController, WebhookController],
  providers: [AdyenService, CredentixPaymentService, WebhookProcessor],
  exports: [CredentixPaymentService, AdyenService],
})
export class PaymentModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentEvent } from './entities/payment-event.entity';
import { WebhookLog } from './entities/webhook-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, PaymentEvent, WebhookLog])],
  controllers: [],
  providers: [],
  exports: [],
})
export class PaymentModule {}

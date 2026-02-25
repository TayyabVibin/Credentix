import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PaymentModule } from './modules/payment/payment.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [UserModule, PaymentModule, WalletModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

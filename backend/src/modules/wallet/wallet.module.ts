import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerEntry } from './entities/ledger-entry.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletEventListener } from './wallet-event.listener';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerEntry]), PaymentModule],
  controllers: [WalletController],
  providers: [WalletService, WalletEventListener],
  exports: [WalletService],
})
export class WalletModule {}

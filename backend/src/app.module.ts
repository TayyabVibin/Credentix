import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { winstonConfig } from './common/logger/winston.config';
import { UserModule } from './modules/user/user.module';
import { PaymentModule } from './modules/payment/payment.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { AdminModule } from './modules/admin/admin.module';
import { User } from './modules/user/entities/user.entity';
import { Payment } from './modules/payment/entities/payment.entity';
import { PaymentEvent } from './modules/payment/entities/payment-event.entity';
import { WebhookLog } from './modules/payment/entities/webhook-log.entity';
import { LedgerEntry } from './modules/wallet/entities/ledger-entry.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonModule.forRoot(winstonConfig),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const baseConfig = {
          type: 'postgres' as const,
          entities: [User, Payment, PaymentEvent, WebhookLog, LedgerEntry],
          synchronize: config.get('NODE_ENV') !== 'production',
          logging: config.get('NODE_ENV') === 'development',
          ssl: true,
        };
        if (databaseUrl) {
          return { ...baseConfig, url: databaseUrl };
        }
        return {
          ...baseConfig,
          host: config.getOrThrow<string>('DB_HOST'),
          port: parseInt(config.get('POSTGRES_PORT', '5432'), 10),
          username: config.getOrThrow<string>('POSTGRES_USER'),
          password: config.getOrThrow<string>('POSTGRES_PASSWORD'),
          database: config.getOrThrow<string>('POSTGRES_DB'),
        };
      },
    }),
    UserModule,
    PaymentModule,
    WalletModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

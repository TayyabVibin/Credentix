import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, CheckoutAPI, EnvironmentEnum } from '@adyen/api-library';
import { CreateCheckoutSessionRequest } from '@adyen/api-library/lib/src/typings/checkout/createCheckoutSessionRequest';

export interface CreateSessionParams {
  amountMinor: number;
  currency: string;
  merchantReference: string;
  shopperReference: string;
  returnUrl: string;
  idempotencyKey: string;
}

export interface AdyenSessionResult {
  sessionId: string;
  sessionData: string;
  url?: string;
}

@Injectable()
export class AdyenService {
  private readonly logger = new Logger(AdyenService.name);
  private readonly checkout: CheckoutAPI;
  private readonly merchantAccount: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('ADYEN_API_KEY', '');
    const environment = this.config.get<string>('ADYEN_ENVIRONMENT', 'TEST');

    const client = new Client({
      apiKey,
      environment:
        environment.toUpperCase() === 'LIVE'
          ? EnvironmentEnum.LIVE
          : EnvironmentEnum.TEST,
    });

    this.checkout = new CheckoutAPI(client);
    this.merchantAccount = this.config.get<string>(
      'ADYEN_MERCHANT_ACCOUNT',
      '',
    );
  }

  async createSession(
    params: CreateSessionParams,
  ): Promise<AdyenSessionResult> {
    this.logger.log(
      `Creating Adyen session for ref=${params.merchantReference}`,
    );

    const response = await this.checkout.PaymentsApi.sessions({
      amount: {
        value: params.amountMinor,
        currency: params.currency,
      },
      merchantAccount: this.merchantAccount,
      reference: params.merchantReference,
      shopperReference: params.shopperReference,
      returnUrl: params.returnUrl,
      channel: CreateCheckoutSessionRequest.ChannelEnum.Web,
      countryCode: 'US',
    });

    return {
      sessionId: response.id,
      sessionData: response.sessionData ?? '',
      url: response.url,
    };
  }

  getClientKey(): string {
    return this.config.get<string>('ADYEN_CLIENT_KEY', '');
  }

  getEnvironment(): string {
    return this.config.get<string>('ADYEN_ENVIRONMENT', 'test');
  }
}

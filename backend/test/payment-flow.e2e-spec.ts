import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { AdyenService } from '../src/modules/payment/adyen.service';

const mockAdyenSession = {
  sessionId: 'mock-session-id',
  sessionData: 'mock-session-data',
  url: 'https://checkout.example.com',
};

describe('Payment Flow (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let paymentId: string;
  let merchantReference: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AdyenService)
      .useValue({
        createSession: jest.fn().mockResolvedValue(mockAdyenSession),
        getClientKey: () => 'test-client-key',
        getEnvironment: () => 'test',
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const userRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `pay-${Date.now()}@example.com`,
        password: 'Password123!',
      });
    userToken = userRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /wallet/purchase - initiates payment', () => {
    return request(app.getHttpServer())
      .post('/wallet/purchase')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        bundleId: 'bundle_10',
        returnUrl: 'http://localhost:3000/return',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('paymentId');
        expect(res.body).toHaveProperty('merchantReference');
        expect(res.body).toHaveProperty(
          'sessionId',
          mockAdyenSession.sessionId,
        );
        paymentId = res.body.paymentId;
        merchantReference = res.body.merchantReference;
      });
  });

  it('POST /webhooks/adyen - CAPTURE success allocates credits', async () => {
    const email = `webhook-${Date.now()}@example.com`;
    const regRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'Password123!' });
    const token = regRes.body.accessToken;

    const purchaseRes = await request(app.getHttpServer())
      .post('/wallet/purchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bundleId: 'bundle_10',
        returnUrl: 'http://localhost:3000/return',
      })
      .expect(201);

    const pspRef = `TEST${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
    const merchantRef = purchaseRes.body.merchantReference;

    const authPayload = {
      live: 'false',
      notificationItems: [
        {
          NotificationRequestItem: {
            pspReference: pspRef,
            merchantReference: merchantRef,
            eventCode: 'AUTHORISATION',
            success: 'true',
            amount: { value: 1000, currency: 'USD' },
          },
        },
      ],
    };

    const capturePayload = {
      live: 'false',
      notificationItems: [
        {
          NotificationRequestItem: {
            pspReference: pspRef,
            merchantReference: merchantRef,
            eventCode: 'CAPTURE',
            success: 'true',
            amount: { value: 1000, currency: 'USD' },
          },
        },
      ],
    };

    await request(app.getHttpServer())
      .post('/webhooks/adyen')
      .set('Content-Type', 'application/json')
      .send(authPayload)
      .expect(200);

    await request(app.getHttpServer())
      .post('/webhooks/adyen')
      .set('Content-Type', 'application/json')
      .send(capturePayload)
      .expect(200);

    const walletRes = await request(app.getHttpServer())
      .get('/wallet')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(walletRes.body.balance).toBe(100);
  });

  it('POST /webhooks/adyen - duplicate webhook does not double-allocate', async () => {
    const email = `dup-${Date.now()}@example.com`;
    const regRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'Password123!' });
    const token = regRes.body.accessToken;

    const purchaseRes = await request(app.getHttpServer())
      .post('/wallet/purchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bundleId: 'bundle_25',
        returnUrl: 'http://localhost:3000/return',
      })
      .expect(201);

    const pspRef = `DUP${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
    const merchantRef = purchaseRes.body.merchantReference;

    const authPayload = {
      live: 'false',
      notificationItems: [
        {
          NotificationRequestItem: {
            pspReference: pspRef,
            merchantReference: merchantRef,
            eventCode: 'AUTHORISATION',
            success: 'true',
            amount: { value: 2500, currency: 'USD' },
          },
        },
      ],
    };

    const capturePayload = {
      live: 'false',
      notificationItems: [
        {
          NotificationRequestItem: {
            pspReference: pspRef,
            merchantReference: merchantRef,
            eventCode: 'CAPTURE',
            success: 'true',
            amount: { value: 2500, currency: 'USD' },
          },
        },
      ],
    };

    await request(app.getHttpServer())
      .post('/webhooks/adyen')
      .set('Content-Type', 'application/json')
      .send(authPayload)
      .expect(200);

    await request(app.getHttpServer())
      .post('/webhooks/adyen')
      .set('Content-Type', 'application/json')
      .send(capturePayload)
      .expect(200);

    await request(app.getHttpServer())
      .post('/webhooks/adyen')
      .set('Content-Type', 'application/json')
      .send(capturePayload)
      .expect(200);

    const walletRes = await request(app.getHttpServer())
      .get('/wallet')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(walletRes.body.balance).toBe(300);
  });
});

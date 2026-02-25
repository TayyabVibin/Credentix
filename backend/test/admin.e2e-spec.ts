import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('Admin (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@credentix.local', password: 'Admin123!' });
    if (adminLogin.status === 201) {
      adminToken = adminLogin.body.accessToken;
    }

    const userRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `user-${Date.now()}@example.com`,
        password: 'Password123!',
      });
    userToken = userRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /admin/metrics - 403 as regular user', () => {
    return request(app.getHttpServer())
      .get('/admin/metrics')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('GET /admin/metrics - returns structure as admin', function () {
    if (!adminToken) {
      this.skip();
    }
    return request(app.getHttpServer())
      .get('/admin/metrics')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('dailyVolume');
        expect(res.body).toHaveProperty('totalVolume7d');
        expect(res.body).toHaveProperty('successRate');
        expect(res.body).toHaveProperty('pendingCount');
        expect(res.body).toHaveProperty('authorizedCount');
        expect(res.body).toHaveProperty('capturedCount');
        expect(Array.isArray(res.body.dailyVolume)).toBe(true);
      });
  });

  it('GET /admin/payments - 403 as regular user', () => {
    return request(app.getHttpServer())
      .get('/admin/payments')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('GET /admin/webhooks - 403 as regular user', () => {
    return request(app.getHttpServer())
      .get('/admin/webhooks')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});

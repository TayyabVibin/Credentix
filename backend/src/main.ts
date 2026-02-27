import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

const DB_VARS = [
  'DB_HOST',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB',
];

function validateEnv(): void {
  const logger = new Logger('Bootstrap');
  if (!process.env.JWT_SECRET) {
    logger.error('Missing required environment variable: JWT_SECRET');
    process.exit(1);
  }
  const hasDbUrl = !!process.env.DATABASE_URL;
  const hasDbVars = DB_VARS.every((key) => process.env[key]);
  if (!hasDbUrl && !hasDbVars) {
    logger.error(
      `Missing database config: set DATABASE_URL or (${DB_VARS.join(', ')})`,
    );
    process.exit(1);
  }
}

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Credentix API')
    .setDescription('Credit-based SaaS platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Credentix API running on port ${port}`);
  logger.log(`Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();

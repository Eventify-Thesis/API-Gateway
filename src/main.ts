import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AppExceptionFilter } from './common/exceptions/app-exception.filter';
import { rawBodyMiddleware } from './middleware/raw-body.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  // Apply raw body middleware before other middleware
  app.use(rawBodyMiddleware());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(cookieParser());
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true); // Reflect request origin
    },
    credentials: true,
  });
  app.useGlobalFilters(new AppExceptionFilter());

  const configService = app.get(ConfigService);

  await app.listen(3000);
}
bootstrap();

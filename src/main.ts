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
    rawBody: false, // Disable default body parser
    bodyParser: false,
  });

  // Apply custom raw body middleware that handles both webhooks and regular requests
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
  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppExceptionFilter } from './common/exceptions/app-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: { port: 8079 },
  });

  await app.startAllMicroservices();
}
bootstrap();

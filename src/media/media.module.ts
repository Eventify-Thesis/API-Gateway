import { Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { MediaServiceProxy } from './services/media.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        },
      },
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaServiceProxy],
  exports: [MediaServiceProxy],
})
export class MediaModule {}

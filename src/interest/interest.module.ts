import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InterestController } from './interest.controller';
import { InterestService } from './interest.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8081,
        },
      },
    ]),
  ],
  controllers: [InterestController],
  providers: [InterestService],
})
export class InterestModule {}

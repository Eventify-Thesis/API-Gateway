import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { TicketServiceProxy } from '../ticket/ticket.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TICKET_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: '127.0.0.1',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [SeatController],
  providers: [SeatService, TicketServiceProxy],
  exports: [SeatService],
})
export class SeatGatewayModule {}

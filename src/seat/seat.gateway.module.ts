import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { TicketServiceProxy } from '../ticket/ticket.service';
import { SSEEventsController } from './sse.events.controller';

@Module({
  imports: [
  ],
  controllers: [SeatController, SSEEventsController],
  providers: [SeatService, TicketServiceProxy],
  exports: [SeatService],
})
export class SeatGatewayModule { }

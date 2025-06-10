import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TicketServiceProxy } from 'src/ticket/ticket.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TICKET_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        },
      },
    ]),
  ],
  controllers: [BookingsController, PaymentController],
  providers: [BookingsService, TicketServiceProxy],
})
export class BookingsModule {}

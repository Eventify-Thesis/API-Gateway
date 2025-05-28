import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { PlannerEventsController } from './event/controller/planner-event.controller';
import { PlannerEventServiceProxy } from './event/services/planner-event.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClerkClientProvider } from './providers/clerk-client.provider';
import { AuthModule } from './auth/auth.module';
import { SeatGatewayModule } from './seat/seat.gateway.module';
import { SeatController } from './seat/seat.controller';
import { SSEEventsController } from './seat/sse.events.controller';
import { EventServiceProxy } from './event/services/event.service';
import { EventController } from './event/controller/event.controller';
import { BookingsModule } from './bookings/bookings.module';
import { OrderController } from './event/controller/order.controller';
import { SearchModule } from './search/search.module';
import { SearchController } from './search/search.controller';
import { InterestModule } from './interest/interest.module';
import { SpeechModule } from './speech/speech.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    AuthModule,
    SeatGatewayModule,
    BookingsModule,
    SearchModule,
    InterestModule,
    SpeechModule,
  ],
  controllers: [
    AppController,
    PlannerEventsController,
    SeatController,
    SSEEventsController,
    EventController,
    OrderController,
    SearchController,
  ],
  providers: [
    AppService,
    EventServiceProxy,
    PlannerEventServiceProxy,
    ClerkClientProvider,
  ],
})
export class AppModule {}

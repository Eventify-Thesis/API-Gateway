import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { PlannerEventsController } from './event/controller/planner-event.controller';
import { EventServiceProxy } from './event/services/event.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClerkClientProvider } from './providers/clerk-client.provider';
import { AuthModule } from './auth/auth.module';
import { SeatGatewayModule } from './seat/seat.gateway.module';
import { SeatController } from './seat/seat.controller';
import { SSEEventsController } from './seat/sse.events.controller';

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
  ],
  controllers: [
    AppController,
    PlannerEventsController,
    SeatController,
    SSEEventsController,
  ],
  providers: [
    AppService,
    EventServiceProxy,
    ClerkClientProvider,
  ],
})
export class AppModule {}

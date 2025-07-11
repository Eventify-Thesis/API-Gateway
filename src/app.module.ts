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
import { CommentServiceProxy } from './event/services/comment.service';
import { CommentController } from './event/controller/comment.controller';
import { IssueReportServiceProxy } from './event/services/issue-report.service';
import { IssueReportController } from './event/controller/issue-report.controller';
import { BookingsModule } from './bookings/bookings.module';
import { OrderController } from './event/controller/order.controller';
import { SearchModule } from './search/search.module';
import { SearchController } from './search/search.controller';
import { InterestModule } from './interest/interest.module';
import { SpeechModule } from './speech/speech.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        },
      },
      {
        name: 'TICKET_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        },
      },
    ]),
    AuthModule,
    SeatGatewayModule,
    BookingsModule,
    SearchModule,
    InterestModule,
    SpeechModule,
    MediaModule,
  ],
  controllers: [
    AppController,
    PlannerEventsController,
    SeatController,
    SSEEventsController,
    EventController,
    OrderController,
    SearchController,
    CommentController,
    IssueReportController,
  ],
  providers: [
    AppService,
    EventServiceProxy,
    PlannerEventServiceProxy,
    CommentServiceProxy,
    IssueReportServiceProxy,
    ClerkClientProvider,
  ],
})
export class AppModule {}

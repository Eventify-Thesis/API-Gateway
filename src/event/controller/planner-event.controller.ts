import {
  Controller,
  Get,
  Req,
  Query,
  Param,
  UseGuards,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { EventServiceProxy } from '../services/event.service';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';

@Controller('event/planner/events')
@UseGuards(ClerkAuthGuard)
export class PlannerEventsController {
  constructor(private readonly eventService: EventServiceProxy) {}

  @Get('')
  async list(@Req() req, @Query() query) {
    const user = req.user;
    const pagination = {
      limit: parseInt(query.limit || '10'),
      page: parseInt(query.page || '1'),
    };
    return await this.eventService.listEvents(user, pagination, query);
  }
  // Add other endpoints as needed...
}

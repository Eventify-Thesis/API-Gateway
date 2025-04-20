import { Controller, Get, Req, Query, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { PlannerEventServiceProxy } from '../services/planner-event.service';

@Controller('event/planner/events')
@UseGuards(ClerkAuthGuard)
export class PlannerEventsController {
  constructor(private readonly eventService: PlannerEventServiceProxy) {}

  @Get('')
  async list(@Req() req, @Query() query) {
    const user = req.user;
    const pagination = {
      limit: parseInt(query.limit || '10'),
      page: parseInt(query.page || '1'),
    };
    return await this.eventService.listEvents(user, pagination, query);
  }
}

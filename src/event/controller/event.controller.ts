import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { EventDetailResponse, ShowResponse } from 'src/event/dto/event-doc.dto';
import { EventServiceProxy } from '../services/event.service';
import { AppException } from 'src/common/exceptions/app.exception';
import { MESSAGE } from '../event.constant';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventServiceProxy) { }

  @Get(':id')
  @ApiResponse({ type: EventDetailResponse })
  async findOne(@Param('id') id: number) {
    const event = await this.eventService.getEventDetails(id);
    if (!event) throw new AppException(MESSAGE.EVENT_NOT_FOUND);
    return event;
  }

  @Get(':id/shows/:showId')
  @ApiResponse({ type: ShowResponse })
  async findOneShow(@Param('id') id: number, @Param('showId') showId: number) {
    const show = await this.eventService.getEventShowDetails(id, showId);
    if (!show) throw new AppException(MESSAGE.SHOW_NOT_FOUND);
    return show;
  }

  @Get(':id/seating-plan/:seatingPlanId')
  @ApiResponse({ type: ShowResponse })
  async getEventShowSeatingPlan(
    @Param('id') id: number,
    @Param('seatingPlanId') seatingPlanId: number,
  ) {
    const seatingPlan = await this.eventService.getEventShowSeatingPlan(
      id,
      seatingPlanId,
    );
    if (!seatingPlan) throw new AppException(MESSAGE.SEATING_PLAN_NOT_FOUND);
    return seatingPlan;
  }

  @Get(':id/questions')
  async getEventShowQuestion(
    @Param('id') id: number,
  ) {
    const question = await this.eventService.getEventQuestions(
      id,
    );
    if (!question) throw new AppException(MESSAGE.QUESTION_NOT_FOUND);
    return question;
  }

}

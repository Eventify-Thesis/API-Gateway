import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { EventDetailResponse, ShowResponse } from 'src/event/dto/event-doc.dto';
import { EventServiceProxy } from '../services/event.service';
import { AppException } from 'src/common/exceptions/app.exception';
import { MESSAGE } from '../event.constant';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventServiceProxy) {}

  @Get(':id')
  @ApiResponse({ type: EventDetailResponse })
  async findOne(@Param('id') id: string) {
    const eventId = parseInt(id, 10);
    if (isNaN(eventId))
      throw new AppException({
        message: 'Invalid event ID',
        error: 'INVALID_EVENT_ID',
        httpStatus: 400,
      });
    const event = await this.eventService.getEventDetails(eventId);
    if (!event) throw new AppException(MESSAGE.EVENT_NOT_FOUND);
    return event;
  }

  @Get(':id/shows/:showId')
  @ApiResponse({ type: ShowResponse })
  async findOneShow(@Param('id') id: string, @Param('showId') showId: string) {
    const eventId = parseInt(id, 10);
    const showIdNum = parseInt(showId, 10);
    if (isNaN(eventId) || isNaN(showIdNum))
      throw new AppException({
        message: 'Invalid event ID or show ID',
        error: 'INVALID_PARAMETERS',
        httpStatus: 400,
      });
    const show = await this.eventService.getEventShowDetails(
      eventId,
      showIdNum,
    );
    if (!show) throw new AppException(MESSAGE.SHOW_NOT_FOUND);
    return show;
  }

  @Get(':id/seating-plan/:seatingPlanId')
  @ApiResponse({ type: ShowResponse })
  async getEventShowSeatingPlan(
    @Param('id') id: string,
    @Param('seatingPlanId') seatingPlanId: string,
  ) {
    const eventId = parseInt(id, 10);
    const seatingPlanIdNum = parseInt(seatingPlanId, 10);
    if (isNaN(eventId) || isNaN(seatingPlanIdNum))
      throw new AppException({
        message: 'Invalid event ID or seating plan ID',
        error: 'INVALID_PARAMETERS',
        httpStatus: 400,
      });
    const seatingPlan = await this.eventService.getEventShowSeatingPlan(
      eventId,
      seatingPlanIdNum,
    );
    if (!seatingPlan) throw new AppException(MESSAGE.SEATING_PLAN_NOT_FOUND);
    return seatingPlan;
  }

  @Get(':id/questions')
  async getEventShowQuestion(@Param('id') id: string) {
    const eventId = parseInt(id, 10);
    if (isNaN(eventId))
      throw new AppException({
        message: 'Invalid event ID',
        error: 'INVALID_EVENT_ID',
        httpStatus: 400,
      });
    const question = await this.eventService.getEventQuestions(eventId);
    if (!question) throw new AppException(MESSAGE.QUESTION_NOT_FOUND);
    return question;
  }
}

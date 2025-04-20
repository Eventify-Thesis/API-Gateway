import { Controller, Get, Post, Body, Query, Req, UsePipes, ValidationPipe, UseGuards, Delete, Put } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { SubmitTicketInfoDto } from './dto/submit-ticket-info.dto';
import RequestWithUser from 'src/auth/role/requestWithUser.interface';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { ApiQuery } from '@nestjs/swagger';
import { QuestionAnswerDto } from './dto/question-answer.dto';

@Controller('bookings')
@UseGuards(ClerkAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post('submit-ticket-info')
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Req() req: RequestWithUser,
    @Body() submitTicketInfoDto: SubmitTicketInfoDto) {
    const answer = await this.bookingsService.submitTicketInfo({
      ...submitTicketInfoDto,
      userId: req.user.id
    }
    );
    return answer;
  }

  @Get('status')
  @ApiQuery({ name: 'showId', required: true })
  @ApiQuery({ name: 'bookingCode', required: true })
  getBookingStatus(
    @Query('showId') showId: number,
    @Query('bookingCode') bookingCode: string,
  ) {
    return this.bookingsService.getBookingStatus(showId, bookingCode);
  }

  @Delete('cancel-booking')
  @ApiQuery({ name: 'showId', required: true })
  @ApiQuery({ name: 'bookingCode', required: true })
  cancelBooking(
    @Query('showId') showId: number,
    @Query('bookingCode') bookingCode: string,
  ) {
    return this.bookingsService.cancelBooking(showId, bookingCode);
  }

  @Put('answers')
  @ApiQuery({ name: 'showId', required: true })
  @ApiQuery({ name: 'bookingCode', required: true })
  updateAnswers(
    @Query('showId') showId: number,
    @Query('bookingCode') bookingCode: string,
    @Body() questionAnswers: QuestionAnswerDto) {
    console.log('get answers', questionAnswers)
    return this.bookingsService.updateAnswers({
      ...questionAnswers,
      showId,
      bookingCode
    });
  }

  @Get('answers')
  @ApiQuery({ name: 'showId', required: true })
  @ApiQuery({ name: 'bookingCode', required: true })
  getFormAnswers(
    @Query('showId') showId: number,
    @Query('bookingCode') bookingCode: string,
  ) {
    return this.bookingsService.getFormAnswers(showId, bookingCode);
  }

}

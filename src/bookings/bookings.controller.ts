import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { SubmitTicketInfoDto } from './dto/submit-ticket-info.dto';
import RequestWithUser from 'src/auth/role/requestWithUser.interface';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { ApiQuery } from '@nestjs/swagger';
import { QuestionAnswerDto } from './dto/question-answer.dto';
import { Stripe } from 'stripe';
import { RawBodyRequest } from '@nestjs/common/interfaces';

@Controller('bookings')
@UseGuards(ClerkAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('submit-ticket-info')
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Req() req: RequestWithUser,
    @Body() submitTicketInfoDto: SubmitTicketInfoDto,
  ) {
    const answer = await this.bookingsService.submitTicketInfo({
      ...submitTicketInfoDto,
      userId: req.user.id,
    });
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
    @Body() questionAnswers: QuestionAnswerDto,
  ) {
    return this.bookingsService.updateAnswers({
      ...questionAnswers,
      showId,
      bookingCode,
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

  @Get('vouchers/:eventId/:showId')
  async getAvailableVouchers(
    @Param('eventId') eventId: number,
    @Param('showId') showId: number,
  ) {
    return this.bookingsService.getAvailableVouchers(eventId, showId);
  }

  @Post('vouchers/:showId/:bookingCode/apply')
  async applyVoucher(
    @Param('showId') showId: number,
    @Param('bookingCode') bookingCode: string,
    @Body() { voucherCode }: { voucherCode: string },
  ) {
    return this.bookingsService.applyVoucher(showId, bookingCode, voucherCode);
  }

  @Post('create-payment-intent')
  createPaymentIntent(@Body() body: any) {
    console.log('create payment intent', body);
    return this.bookingsService.createPaymentIntent(body);
  }

  @Post('complete-free-order')
  async completeFreeOrder(@Body() body: { orderId: number }) {
    console.log('complete free order', body);
    return this.bookingsService.completeFreeOrder(body.orderId);
  }
}

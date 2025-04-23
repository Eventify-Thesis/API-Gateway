import { Injectable } from '@nestjs/common';
import { SubmitTicketInfoDto } from './dto/submit-ticket-info.dto';
import { TicketServiceProxy } from 'src/ticket/ticket.service';
import { QuestionAnswerDto } from './dto/question-answer.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import Stripe from 'stripe';

@Injectable()
export class BookingsService {

  constructor(private readonly ticketService: TicketServiceProxy) { }

  async submitTicketInfo(dto: SubmitTicketInfoDto) {
    return await this.ticketService.submitTicketInfo(dto);
  }

  async getBookingStatus(showId: number, bookingCode: string) {
    return await this.ticketService.getBookingStatus(showId, bookingCode);
  }

  async cancelBooking(showId: number, bookingCode: string) {
    return await this.ticketService.cancelBooking(showId, bookingCode);
  }

  async getFormAnswers(showId: number, bookingId: string) {
    return await this.ticketService.getFormAnswers(showId, bookingId);
  }

  async updateAnswers(questionAnswers: QuestionAnswerDto) {
    return await this.ticketService.updateAnswers(questionAnswers);
  }

  async createPaymentIntent(data: CreatePaymentIntentDto) {
    return await this.ticketService.createPaymentIntent(data);
  }

  async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    return await this.ticketService.handleSuccessfulPayment({
      orderId: Number(orderId),
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      paidAt: new Date(),
    })
  }

  async handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    return await this.ticketService.handleFailedPayment({
      orderId: Number(orderId),
      paymentIntentId: paymentIntent.id,
      errorMessage: paymentIntent.last_payment_error?.message,
    });
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SubmitTicketInfoDto } from './dto/submit-ticket-info.dto';
import { TicketServiceProxy } from 'src/ticket/ticket.service';
import { QuestionAnswerDto } from './dto/question-answer.dto';

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
}

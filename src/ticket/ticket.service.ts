import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientOptions,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreatePaymentIntentDto } from 'src/bookings/dto/create-payment-intent.dto';
import { QuestionAnswerDto } from 'src/bookings/dto/question-answer.dto';

@Injectable()
export class TicketServiceProxy {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {
    // create initial client
    this.initClient();
  }

  private initClient() {
    const options: ClientOptions = {
      transport: Transport.REDIS,
      options: {
        host: this.configService.get('REDIS.HOST') || 'localhost',
        port: this.configService.get('REDIS.PORT') || 6379,
      },
    };
    this.client = ClientProxyFactory.create(options);
  }

  async tryClient<T>(callback: () => Promise<T>) {
    try {
      return await callback();
    } catch (error) {
      // If the connection is lost or closed:
      if (error.message === 'Connection closed') {
        console.error('Connection closed. Attempting to re-init client...');
        this.initClient(); // Recreate the client
        // Optionally try again
        // return await callback();
      }
      console.error(error);
    }
  }

  async getShowSeatAvailability(showId: number) {
    return await this.tryClient(() =>
      this.client.send('getShowSeatAvailability', showId).toPromise(),
    );
  }

  async submitTicketInfo(dto: any) {
    return await this.tryClient(() =>
      this.client.send('submitTicketInfo', dto).toPromise(),
    );
  }

  async getBookingStatus(showId: number, bookingCode: string) {
    return await this.tryClient(() =>
      this.client.send('getBookingStatus', { showId, bookingCode }).toPromise(),
    );
  }

  async cancelBooking(showId: number, bookingCode: string) {
    return await this.tryClient(() =>
      this.client.send('cancelBooking', { showId, bookingCode }).toPromise(),
    );
  }

  async getFormAnswers(showId: number, bookingId: string) {
    return await this.tryClient(() =>
      this.client.send('getFormAnswers', { showId, bookingId }).toPromise(),
    );
  }

  async updateAnswers(questionAnswers: QuestionAnswerDto) {
    return await this.tryClient(() =>
      this.client.send('updateAnswers', questionAnswers).toPromise(),
    );
  }

  async createPaymentIntent(data: CreatePaymentIntentDto) {
    return await this.tryClient(() =>
      this.client.send('createPaymentIntent', data.orderId).toPromise(),
    );
  }

  async handleSuccessfulPayment(payload: {
    orderId: number;
    paymentIntentId: string;
    amount: number;
    status: string;
    paidAt: Date;
  }) {
    return await this.tryClient(() =>
      this.client.send('handleSuccessfulPayment', payload).toPromise(),
    );
  }

  async handleFailedPayment(payload: {
    orderId: number;
    paymentIntentId: string;
    errorMessage?: string;
  }) {
    return await this.tryClient(() =>
      this.client.send('handleFailedPayment', payload).toPromise(),
    );
  }

  async getAvailableVouchers(eventId: number, showId: number) {
    return await this.tryClient(() =>
      this.client
        .send('get_available_vouchers', { eventId, showId })
        .toPromise(),
    );
  }

  async applyVoucher(showId: number, bookingCode: string, voucherCode: string) {
    return await this.tryClient(() =>
      this.client
        .send('apply_voucher', { showId, bookingCode, voucherCode })
        .toPromise(),
    );
  }

  async completeFreeOrder(orderId: number) {
    return await this.tryClient(() =>
      this.client.send('completeFreeOrder', { orderId }).toPromise(),
    );
  }
}

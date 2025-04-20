import { Inject, Injectable } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { QuestionAnswerDto } from 'src/bookings/dto/question-answer.dto';

@Injectable()
export class TicketServiceProxy {
  private client: ClientProxy;

  constructor() {
    // create initial client
    this.initClient();
  }

  private initClient() {
    const options: ClientOptions = {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8082,
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
      this.client.send('getShowSeatAvailability', showId).toPromise()
    );
  }

  async submitTicketInfo(dto: any) {
    return await this.tryClient(() =>
      this.client.send('submitTicketInfo', dto).toPromise()
    );
  }

  async getBookingStatus(showId: number, bookingCode: string) {
    return await this.tryClient(() =>
      this.client.send('getBookingStatus', { showId, bookingCode })
        .toPromise()
    );
  }

  async cancelBooking(showId: number, bookingCode: string) {
    return await this.tryClient(() =>
      this.client.send('cancelBooking', { showId, bookingCode })
        .toPromise()
    );
  }

  async getFormAnswers(showId: number, bookingId: string) {
    return await this.tryClient(() =>
      this.client.send('getFormAnswers', { showId, bookingId })
        .toPromise()
    );
  }

  async updateAnswers(questionAnswers: QuestionAnswerDto) {
    return await this.tryClient(() =>
      this.client.send('updateAnswers', questionAnswers).toPromise()
    );
  }
}

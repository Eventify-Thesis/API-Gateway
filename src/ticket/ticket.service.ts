import { Inject, Injectable } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

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

  async getShowSeatAvailability(showId: string) {
    try {
      console.log('Sending getShowSeatAvailability request...');
      return await this.client
        .send('getShowSeatAvailability', showId)
        .toPromise();
    } catch (error) {
      // If the connection is lost or closed:
      if (error.message === 'Connection closed') {
        console.error('Connection closed. Attempting to re-init client...');
        this.initClient(); // Recreate the client
        // Optionally try again
        // return await this.client.send('getShowSeatAvailability', showId).toPromise();
      }
      console.error(error);
    }
  }
}

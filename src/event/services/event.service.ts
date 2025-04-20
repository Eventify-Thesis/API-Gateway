import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EventServiceProxy {
  constructor(@Inject('EVENT_SERVICE') private readonly client: ClientProxy) { }

  async getEventDetails(id: number) {
    return await this.client.send('getEventDetails', id).toPromise();
  }

  async getEventShowDetails(id: number, showId: number) {
    return await this.client
      .send('getEventShowDetails', { id, showId })
      .toPromise();
  }

  async getEventShowSeatingPlan(id: number, seatingPlanId: number) {
    try {
      return await this.client
        .send('getEventShowSeatingPlan', { id, seatingPlanId })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  async getEventQuestions(id: number) {
    try {
      return await this.client.send('getEventQuestions', id).toPromise();
    } catch (error) {
      console.log(error);
    }
  }
}

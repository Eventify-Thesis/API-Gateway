import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EventServiceProxy {
  constructor(@Inject('EVENT_SERVICE') private readonly client: ClientProxy) {}

  async listEvents(user, pagination, query) {
    return await this.client
      .send('planner_event_list', { user, pagination, query })
      .toPromise();
  }
}

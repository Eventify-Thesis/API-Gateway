import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetOrdersQuery } from '../dto/get-orders.dto';

@Injectable()
export class EventServiceProxy {
  constructor(@Inject('EVENT_SERVICE') private readonly client: ClientProxy) {}

  async getEventDetails(id: number) {
    try {
      return await this.client.send('getEventDetails', id).toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  async getEventShowDetails(id: number, showId: number) {
    try {
      return await this.client
        .send('getEventShowDetails', { id, showId })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
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

  async getUserOrders(userId: string, query: GetOrdersQuery) {
    try {
      return await this.client
        .send('getUserOrders', { userId, query })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  async getOrderDetail(orderPublicId: string) {
    try {
      return await this.client
        .send('getOrderDetail', orderPublicId)
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

@Injectable()
export class SearchService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('SEARCH_SERVICE_BASE_URL');
  }

  async searchSemanticEvents(
    query: string,
    userId?: string,
    limit: number = 15,
    city?: string,
    categories?: string | string[],
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    const params: Record<string, any> = { q: query, limit };
    if (userId) params.user_id = userId;
    if (city) params.city = city;
    if (categories) params.categories = categories;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response: AxiosResponse = await this.httpService.axiosRef.get(
      `${this.baseUrl}`,
      { params }
    );
    return response.data;
  }

  async getSearchMetadata(): Promise<any> {
    const response: AxiosResponse = await this.httpService.axiosRef.get(
      `${this.baseUrl}/metadata`
    );
    return response.data;
  }

  async getRelatedEvents(eventId: string, limit: number = 4): Promise<any> {
    const response: AxiosResponse = await this.httpService.axiosRef.get(
      `${this.baseUrl}/events/${eventId}/related`,
      { params: { limit } }
    );
    return response.data;
  }

  async getEventsThisMonth(): Promise<any> {
    const response: AxiosResponse = await this.httpService.axiosRef.get(
      `${this.baseUrl}/events/this-month`
    );
    return response.data;
  }

  async getEventsThisWeek(): Promise<any> {
    const response: AxiosResponse = await this.httpService.axiosRef.get(
      `${this.baseUrl}/events/this-week`
    );
    return response.data;
  }

  async getEventsByCategory(): Promise<any> {
    try {
      const response: AxiosResponse = await this.httpService.axiosRef.get(
        `${this.baseUrl}/events-by-category`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch events by category: ${error.message}`);
    }
  }
}

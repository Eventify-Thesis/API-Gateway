import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

@Injectable()
export class SearchService {
  private baseUrl: string;

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
    page: number = 1,
    city?: string,
    categories?: string,
    startDate?: string,
    endDate?: string,
    min_lat?: number,
    max_lat?: number,
    min_lon?: number,
    max_lon?: number,
  ): Promise<any> {
    try {
      // Prepare search parameters
      const params: Record<string, any> = {
        q: query,
        limit,
        page,
        ...(userId ? { userId } : {}),
        ...(city ? { city } : {}),
        ...(categories ? { categories } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
        ...(min_lat !== undefined ? { min_lat } : {}),
        ...(max_lat !== undefined ? { max_lat } : {}),
        ...(min_lon !== undefined ? { min_lon } : {}),
        ...(max_lon !== undefined ? { max_lon } : {}),
      };

      // Use the existing httpService
      const response: AxiosResponse = await this.httpService.axiosRef.get(
        `${this.baseUrl}`,
        { params },
      );

      return response.data;
    } catch (error) {
      console.error('Error searching semantic events:', error);
      return {
        success: false,
        data: {
          result: [],
          total: 0,
        },
        error: error.message,
      };
    }
  }

  async getSearchMetadata(): Promise<any> {
    const response: AxiosResponse = await this.httpService.axiosRef.get(
      `${this.baseUrl}/metadata`,
    );
    return response.data;
  }

  async getRelatedEvents(
    eventId: number,
    limit: number = 4,
    userId?: string,
  ): Promise<any> {
    const params: Record<string, any> = { limit };
    if (userId) params.userId = userId;
    const response: AxiosResponse = await this.httpService.axiosRef.get(
      `${this.baseUrl}/events/${eventId}/related`,
      { params },
    );
    return response.data;
  }

  async getEventsThisMonth(userId?: string): Promise<any> {
    const params: Record<string, any> = {};
    if (userId) params.userId = userId;
    const response: AxiosResponse = await this.httpService.axiosRef.get(
      `${this.baseUrl}/events/this-month`,
      { params },
    );
    return response.data;
  }

  async getEventsThisWeek(userId?: string): Promise<any> {
    const params: Record<string, any> = {};
    if (userId) params.userId = userId;
    const response: AxiosResponse = await this.httpService.axiosRef.get(
      `${this.baseUrl}/events/this-week`,
      { params },
    );
    return response.data;
  }

  async getEventsByCategory(userId?: string): Promise<any> {
    const params: Record<string, any> = {};
    if (userId) params.userId = userId;
    try {
      const response: AxiosResponse = await this.httpService.axiosRef.get(
        `${this.baseUrl}/events-by-category`,
        { params },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch events by category: ${error.message}`);
    }
  }
}

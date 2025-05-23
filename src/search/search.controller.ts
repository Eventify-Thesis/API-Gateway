import { Controller, Get, Query, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchSemanticEvents(
    @Query('q') query?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit: number = 15,
    @Query('page') page: number = 1,
    @Query('city') city?: string,
    @Query('categories') categories?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // If query is undefined, pass empty string to service for match-all behavior
    const searchQuery = query ?? '';
    return this.searchService.searchSemanticEvents(
      searchQuery, userId, Number(limit), Number(page), city, categories, startDate, endDate
    );
  }

  @Get('metadata')
  async getSearchMetadata() {
    return this.searchService.getSearchMetadata();
  }

  @Get('events/:eventId/related')
  async getRelatedEvents(
    @Param('eventId') eventId: number,
    @Query('limit') limit: number = 4,
    @Query('userId') userId?: string,
  ) {
    return this.searchService.getRelatedEvents(eventId, Number(limit), userId);
  }

  @Get('events/this-month')
  @ApiQuery({ name: 'userId', required: false })
  async getEventsThisMonth(
    @Query('userId') userId?: string,
  ) {
    return this.searchService.getEventsThisMonth(userId);
  }

  @Get('events/this-week')
  async getEventsThisWeek(
    @Query('userId') userId?: string,
  ) {
    return this.searchService.getEventsThisWeek(userId);
  }

  @Get('events-by-category')
  async getEventsByCategory(
    @Query('userId') userId?: string,
  ) {
    return this.searchService.getEventsByCategory(userId);
  }
}

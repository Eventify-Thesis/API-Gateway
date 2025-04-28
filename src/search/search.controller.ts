import { Controller, Get, Query, Param } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchSemanticEvents(
    @Query('q') query: string,
    @Query('user_id') userId?: string,
    @Query('limit') limit: number = 15,
    @Query('city') city?: string,
    @Query('categories') categories?: string | string[],
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.searchService.searchSemanticEvents(
      query, userId, Number(limit), city, categories, startDate, endDate
    );
  }

  @Get('metadata')
  async getSearchMetadata() {
    return this.searchService.getSearchMetadata();
  }

  @Get('events/:eventId/related')
  async getRelatedEvents(
    @Param('eventId') eventId: string,
    @Query('limit') limit: number = 4,
  ) {
    return this.searchService.getRelatedEvents(eventId, Number(limit));
  }
}

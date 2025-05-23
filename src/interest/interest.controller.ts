import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { MESSAGE } from './interest.constant';

@Controller('interests')
export class InterestController {
  @Get('users/:userId/interests')
  async findAllInterest(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    if (!userId) {
      throw new BadRequestException(MESSAGE.USER_ID_REQUIRED);
    }
    return await this.interestService.findAllInterest(userId, Number(page), Number(limit));
  }
  constructor(private readonly interestService: InterestService) {}

  @Post()
  async create(@Body() createInterestDto: CreateInterestDto) {
    return await this.interestService.create(createInterestDto);
  }

  @Get('users/:userId/events/:eventId')
  async checkExist(
    @Param('userId') userId: string,
    @Param('eventId') eventId: number,
  ) {
    return await this.interestService.checkExist(userId, eventId);
  }

  @Delete('users/:userId/events/:eventId')
  async remove(
    @Param('userId') userId: string,
    @Param('eventId') eventId: number,
  ) {
    return await this.interestService.remove(userId, eventId);
  }
}

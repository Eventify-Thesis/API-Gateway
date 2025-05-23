import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateInterestDto } from './dto/create-interest.dto';
import { MESSAGE } from './interest.constant';

@Injectable()
export class InterestService {
  constructor(
    @Inject('EVENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(createInterestDto: CreateInterestDto) {
    if (!createInterestDto.userId || !createInterestDto.eventId) {
      throw new BadRequestException(MESSAGE.USER_ID_REQUIRED);
    }
    return this.client.send('interestCreate', createInterestDto).toPromise();
  }

  async findAllInterest(userId: string, page = 1, limit = 10) {
    if (!userId) {
      throw new BadRequestException(MESSAGE.USER_ID_REQUIRED);
    }
    return this.client.send('interestFindAllInterest', { userId, pagination: { page, limit } }).toPromise();
  }

  async checkExist(userId: string, eventId: number) {
    if (!userId || !eventId) {
      throw new BadRequestException(MESSAGE.USER_ID_REQUIRED);
    }
    return this.client.send('interestCheckExist', { userId, eventId }).toPromise();
  }

  async remove(userId: string, eventId: number) {
    if (!userId || !eventId) {
      throw new BadRequestException(MESSAGE.USER_ID_REQUIRED);
    }
    return this.client.send('interestRemove', { userId, eventId }).toPromise();
  }
}

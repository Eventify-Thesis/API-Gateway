import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SeatService } from './seat.service';

@Controller()
export class SSEEventsController {
  constructor(private readonly seatService: SeatService) { }

  @MessagePattern('seatUpdated')
  handleSeatUpdate(
    @Payload() data: { showId: number; payload: string },
  ) {
    this.seatService.broadcast(data.showId, data.payload);
  }
}

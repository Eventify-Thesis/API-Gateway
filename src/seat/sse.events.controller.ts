import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SeatService } from './seat.service';

@Controller()
export class SSEEventsController {
  constructor(private readonly seatService: SeatService) {}

  @MessagePattern('seatUpdated')
  handleSeatUpdate(
    @Payload() payload: { showId: string; seatId: string; status: string },
  ) {
    this.seatService.broadcast(payload.showId, payload);
  }
}

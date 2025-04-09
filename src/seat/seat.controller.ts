import {
  Controller,
  Get,
  Sse,
  Param,
  MessageEvent,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SeatService } from './seat.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Get(':showId/availability/stream')
  @Sse()
  subscribe(
    @Param('showId') showId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Observable<MessageEvent> {
    const subject = this.seatService.getSubject(showId);

    // Optional: Immediately fetch once
    this.seatService.fetchAndBroadcastAvailability(showId);

    // 👇 Cleanup on client disconnect
    req.on('close', () => {
      console.log('Client disconnected', showId);
      this.seatService.removeSubscriber(showId);
    });

    return subject.asObservable().pipe(map(data => ({ data })));
  }
}

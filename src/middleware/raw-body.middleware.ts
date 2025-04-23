import { Request, Response } from 'express';
import { json } from 'express';
import { RawBodyRequest } from '@nestjs/common';

export function rawBodyMiddleware() {
  return json({
    verify: (req: RawBodyRequest<Request>, res: Response, buf: Buffer) => {
      if (req.url === '/bookings/webhook' && buf.length) {
        req.rawBody = buf;
      }
      return true;
    },
  });
}

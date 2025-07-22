import { Request, Response, NextFunction } from 'express';
import { json, raw, urlencoded } from 'express';
import { RawBodyRequest } from '@nestjs/common';

export function rawBodyMiddleware() {
  return (req: RawBodyRequest<Request>, res: Response, next: NextFunction) => {
    // For webhook endpoints, use raw middleware to preserve the original buffer
    if (req.path === '/bookings/webhook' || req.url === '/bookings/webhook') {
      return raw({ 
        type: 'application/json',
        limit: '50mb',
        verify: (req: RawBodyRequest<Request>, res: Response, buf: Buffer) => {
          req.rawBody = buf;
        }
      })(req, res, next);
    } else {
      // Handle different content types
      const contentType = req.get('content-type') || '';
      
      if (contentType.includes('application/x-www-form-urlencoded')) {
        return urlencoded({ 
          limit: '50mb',
          extended: true,
          verify: (req: RawBodyRequest<Request>, res: Response, buf: Buffer) => {
            if (buf.length > 0) {
              req.rawBody = buf;
            }
          }
        })(req, res, next);
      } else {
        // Default to JSON middleware
        return json({ 
          limit: '50mb',
          verify: (req: RawBodyRequest<Request>, res: Response, buf: Buffer) => {
            if (buf.length > 0) {
              req.rawBody = buf;
            }
          }
        })(req, res, next);
      }
    }
  };
}

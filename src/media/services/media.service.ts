import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface SignedUrlRequest {
  fileName: string;
  contentType: string;
  isPublic: boolean;
  folder: string;
}

@Injectable()
export class MediaServiceProxy {
  constructor(@Inject('EVENT_SERVICE') private readonly client: ClientProxy) {}

  async getSignedUrlForPuttingObject(params: SignedUrlRequest) {
    try {
      return await this.client
        .send('getSignedUrlForPuttingObject', params)
        .toPromise();
    } catch (error) {
      console.log('Error getting signed URL:', error);
      throw error;
    }
  }
}

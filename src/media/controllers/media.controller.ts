import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { MediaServiceProxy, SignedUrlRequest } from '../services/media.service';
import { AppException } from 'src/common/exceptions/app.exception';

@ApiTags('media')
@Controller('media')
@UseGuards(ClerkAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaServiceProxy) {}

  @Get('signedUrlForPuttingObject')
  @ApiResponse({ description: 'Get signed URL for uploading object to S3' })
  @ApiQuery({
    name: 'fileName',
    required: true,
    type: 'string',
    example: 'test.jpg',
  })
  @ApiQuery({
    name: 'contentType',
    required: true,
    type: 'string',
    example: 'image/jpeg',
  })
  @ApiQuery({
    name: 'isPublic',
    required: true,
    type: 'boolean',
    example: true,
  })
  @ApiQuery({
    name: 'folder',
    required: true,
    type: 'string',
    example: 'comment-images',
  })
  async getSignedUrlForPuttingObject(
    @Query('fileName') fileName: string,
    @Query('contentType') contentType: string,
    @Query('isPublic') isPublic: string,
    @Query('folder') folder: string,
  ) {
    if (!fileName || !contentType || !folder) {
      throw new AppException({
        message: 'Missing required parameters',
        error: 'MISSING_PARAMETERS',
        httpStatus: 400,
      });
    }

    try {
      const params: SignedUrlRequest = {
        fileName,
        contentType,
        isPublic: isPublic === 'true',
        folder,
      };

      const result = await this.mediaService.getSignedUrlForPuttingObject(
        params,
      );
      return result;
    } catch (error) {
      console.log('Error in getSignedUrlForPuttingObject:', error);
      throw new AppException({
        message: 'Failed to generate signed URL',
        error: 'SIGNED_URL_ERROR',
        httpStatus: 500,
      });
    }
  }
}

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

interface ChatRequest {
  query: string;
  userId?: string;
  language?: string;
  maxResults?: number;
}

interface EventResult {
  id: string;
  title: string;
  description: string;
  city: string;
  start_time: string;
  end_time: string;
  category: string;
  score: number;
}

interface ChatResponse {
  text: string;
  events: EventResult[];
  query_embedding_time: number;
  search_time: number;
  generation_time: number;
}

@Controller('user')
export class SpeechController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Post('stt')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('wav')) {
          return cb(
            new BadRequestException('Only WAV files are supported'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'WAV audio file (16kHz, mono)',
        },
        language: {
          type: 'string',
          description: 'Language code for speech recognition (e.g., en, vi)',
        },
      },
    },
  })
  async speechToText(@UploadedFile() file: any, @Body() body: any) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      if (!file.buffer) {
        throw new BadRequestException('File buffer is not available');
      }

      console.log(
        `Processing audio file: ${file.originalname} (${file.size} bytes)`,
      );

      // Get language from body, default to 'en'
      const language = body?.language || 'en';

      // Create form data using Node.js form-data package
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: 'recording.wav',
        contentType: 'audio/wav',
      });

      // Convert language code to appropriate format for Google Speech-to-Text
      let languageCode: string;
      switch (language) {
        case 'vi':
          languageCode = 'vi-VN';
          break;
        case 'en':
          languageCode = 'en-US';
          break;
        default:
          languageCode = 'en-US';
      }

      // Forward request to search service with language parameter
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get<string>(
            'SEARCH_SERVICE_BASE_URL',
          )}/api/stt?language_code=${languageCode}`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          },
        ),
      );

      return (response as AxiosResponse).data;
    } catch (error) {
      console.error('Error in speechToText:', error.message);
      if (error.response?.data?.detail) {
        throw new BadRequestException(error.response.data.detail);
      }
      throw error;
    }
  }

  @Post('chat')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'User query for event search and chat',
        },
        userId: {
          type: 'string',
          description: 'Optional user ID for personalization',
        },
        language: {
          type: 'string',
          description: 'Language preference (default: en)',
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of events to return (default: 5)',
        },
      },
      required: ['query'],
    },
  })
  async chat(@Body() chatRequest: ChatRequest): Promise<ChatResponse> {
    try {
      console.log(`Processing chat query: "${chatRequest.query}"`);

      // Forward request to search service
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get<string>(
            'SEARCH_SERVICE_BASE_URL',
          )}/api/chat`,
          chatRequest,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return (response as AxiosResponse<ChatResponse>).data;
    } catch (error) {
      console.error('Error in chat:', error.message);
      if (error.response?.data?.detail) {
        throw new BadRequestException(error.response.data.detail);
      }
      throw error;
    }
  }
}

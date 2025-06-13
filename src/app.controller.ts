import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
    };
  }

  // @Get('/ping-a')
  // pingServiceA() {
  //   return this.appService.pingServiceA();
  // }

  // @Get('/ping-b')
  // pingServiceB() {
  //   return this.appService.pingServiceB();
  // }
}

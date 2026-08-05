import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';

// Root route stays unversioned (VERSION_NEUTRAL) by convention: load balancer health
// checks and uptime monitors shouldn't need to know the current API version to hit it.
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

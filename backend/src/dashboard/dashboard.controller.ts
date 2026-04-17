import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('stats')
  getStats(@Query('year') year?: string) {
    const y = year ?? new Date().getFullYear().toString();
    return this.service.getStats(y);
  }
}

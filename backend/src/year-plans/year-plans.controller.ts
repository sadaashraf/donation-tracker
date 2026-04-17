import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { YearPlansService } from './year-plans.service';
import { CreateYearPlanDto } from './year-plan.dto';

@Controller('year-plans')
export class YearPlansController {
  constructor(private readonly service: YearPlansService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateYearPlanDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

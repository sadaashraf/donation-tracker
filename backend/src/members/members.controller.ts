import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto, UpdateMemberDto } from './member.dto';
import { PaymentsService } from '../payments/payments.service';
import { YearPlansService } from '../year-plans/year-plans.service';
import { Member } from './member.entity';

@Controller('members')
export class MembersController {
  constructor(
    private readonly service: MembersService,
    private readonly paymentsService: PaymentsService,
    private readonly yearPlansService: YearPlansService,
  ) { }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('year') year?: string,
    @Query('status') status?: string,
  ) {
    const members = await this.service.findAll(search);
    if (!year || !status || status === 'All') return members;

    // Filter by computed status
    const filtered: Member[] = [];
    for (const m of members) {
      const summary = await this.paymentsService.getMemberYearSummary(m.id, year);
      if (summary.status === status) filtered.push(m);
    }
    return filtered;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Get(':id/year/:year/summary')
  async getSummary(@Param('id') id: string, @Param('year') year: string) {
    await this.service.findOne(+id); // ensure member exists
    return this.paymentsService.getMemberYearSummary(+id, year);
  }

  @Post()
  create(@Body() dto: CreateMemberDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

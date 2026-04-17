import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YearPlan } from './year-plan.entity';
import { CreateYearPlanDto } from './year-plan.dto';

@Injectable()
export class YearPlansService {
  constructor(
    @InjectRepository(YearPlan)
    private readonly repo: Repository<YearPlan>,
  ) {}

  findAll() {
    return this.repo.find({ order: { year: 'DESC' } });
  }

  async findByYear(year: string) {
    return this.repo.findOneBy({ year });
  }

  async create(dto: CreateYearPlanDto) {
    const exists = await this.repo.findOneBy({ year: dto.year });
    if (exists) throw new ConflictException(`Year plan for ${dto.year} already exists`);
    const plan = this.repo.create({
      year: dto.year,
      amountRequired: parseFloat(dto.amountRequired),
    });
    return this.repo.save(plan);
  }

  async remove(id: number) {
    const plan = await this.repo.findOneBy({ id });
    if (!plan) throw new NotFoundException(`Year plan #${id} not found`);
    await this.repo.delete(id);
    return { message: 'Year plan deleted' };
  }
}

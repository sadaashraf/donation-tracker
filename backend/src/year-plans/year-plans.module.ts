import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YearPlan } from './year-plan.entity';
import { YearPlansService } from './year-plans.service';
import { YearPlansController } from './year-plans.controller';

@Module({
  imports: [TypeOrmModule.forFeature([YearPlan])],
  controllers: [YearPlansController],
  providers: [YearPlansService],
  exports: [YearPlansService],
})
export class YearPlansModule {}

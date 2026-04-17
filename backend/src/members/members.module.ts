import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { PaymentsModule } from '../payments/payments.module';
import { YearPlansModule } from '../year-plans/year-plans.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), PaymentsModule, YearPlansModule],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}

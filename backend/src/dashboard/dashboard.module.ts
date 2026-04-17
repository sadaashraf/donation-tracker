import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MembersModule } from '../members/members.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [MembersModule, PaymentsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

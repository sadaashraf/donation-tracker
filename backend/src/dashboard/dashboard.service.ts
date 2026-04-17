import { Injectable } from '@nestjs/common';
import { MembersService } from '../members/members.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly membersService: MembersService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async getStats(year: string) {
    const members = await this.membersService.findAll();
    const totalMembers = members.length;
    const memberIds = members.map(m => m.id);

    const [financial, statusCounts, chartData] = await Promise.all([
      this.paymentsService.getDashboardStats(year, totalMembers),
      this.paymentsService.getMemberStatusCounts(year, memberIds),
      this.paymentsService.revenueByMonth(year),
    ]);

    return {
      totalMembers,
      totalRequired: financial.totalRequired,
      totalReceived: financial.totalReceived,
      remaining: financial.remaining,
      paid: statusCounts.paid,
      partial: statusCounts.partial,
      unpaid: statusCounts.unpaid,
      chartData,
    };
  }
}

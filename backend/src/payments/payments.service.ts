import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './payment.dto';
import { YearPlansService } from '../year-plans/year-plans.service';

function computeStatus(totalPaid: number, totalRequired: number): string {
  if (totalPaid === 0) return 'Unpaid';
  if (totalPaid < totalRequired) return 'Partial';
  return 'Paid';
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
    private readonly yearPlansService: YearPlansService,
  ) { }

  findAll(search?: string, year?: string, memberId?: number) {
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.member', 'member')
      .orderBy('p.createdAt', 'DESC');

    if (year && year !== 'All') qb.andWhere('p.year = :year', { year });
    if (memberId) qb.andWhere('p.memberId = :memberId', { memberId });
    if (search) qb.andWhere('member.name ILIKE :search', { search: `%${search}%` });

    return qb.getMany();
  }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id }, relations: ['member'] });
    if (!p) throw new NotFoundException(`Payment #${id} not found`);
    return p;
  }

  async create(dto: CreatePaymentDto, proofPath?: string) {
    const payment = this.repo.create({
      memberId: +dto.memberId,
      year: dto.year,
      amount: parseFloat(dto.amount),
      paymentDate: dto.paymentDate,
      proofPath: proofPath ?? undefined,
    });
    return this.repo.save(payment);
  }

  async update(id: number, dto: UpdatePaymentDto) {
    await this.findOne(id);
    const patch: Partial<Payment> = {};
    if (dto.amount)      patch.amount      = parseFloat(dto.amount);
    if (dto.paymentDate) patch.paymentDate = dto.paymentDate;
    await this.repo.update(id, patch);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Payment deleted' };
  }

  // ── Core aggregation ──────────────────────────────────────
  async getMemberYearSummary(memberId: number, year: string) {
    const plan = await this.yearPlansService.findByYear(year);
    const totalRequired = plan ? parseFloat(plan.amountRequired as any) : 0;

    const result = await this.repo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'totalPaid')
      .where('p.memberId = :memberId AND p.year = :year', { memberId, year })
      .getRawOne();

    const totalPaid = parseFloat(result?.totalPaid ?? '0');
    const remaining = Math.max(0, totalRequired - totalPaid);
    const status = computeStatus(totalPaid, totalRequired);

    return { totalRequired, totalPaid, remaining, status };
  }

  // ── Dashboard aggregations ────────────────────────────────
  async getDashboardStats(year: string, totalMembers: number) {
    const plan = await this.yearPlansService.findByYear(year);
    const totalRequired = plan ? parseFloat(plan.amountRequired as any) * totalMembers : 0;

    const result = await this.repo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'totalReceived')
      .where('p.year = :year', { year })
      .getRawOne();

    const totalReceived = parseFloat(result?.totalReceived ?? '0');
    const remaining = Math.max(0, totalRequired - totalReceived);

    return { totalRequired, totalReceived, remaining };
  }

  async getMemberStatusCounts(year: string, memberIds: number[]) {
    let paid = 0, partial = 0, unpaid = 0;
    if (memberIds.length === 0) return { paid, partial, unpaid };

    const plan = await this.yearPlansService.findByYear(year);
    const totalRequired = plan ? parseFloat(plan.amountRequired as any) : 0;

    const rows = await this.repo
      .createQueryBuilder('p')
      .select('p.memberId', 'memberId')
      .addSelect('COALESCE(SUM(p.amount), 0)', 'totalPaid')
      .where('p.year = :year AND p.memberId IN (:...ids)', { year, ids: memberIds })
      .groupBy('p.memberId')
      .getRawMany();

    const paidMap = new Map(rows.map(r => [+r.memberId, parseFloat(r.totalPaid)]));

    for (const id of memberIds) {
      const s = computeStatus(paidMap.get(id) ?? 0, totalRequired);
      if (s === 'Paid') paid++;
      else if (s === 'Partial') partial++;
      else unpaid++;
    }
    return { paid, partial, unpaid };
  }

  revenueByMonth(year: string) {
    return this.repo
      .createQueryBuilder('p')
      .select("TO_CHAR(p.\"paymentDate\"::date, 'Mon')", 'month')
      .addSelect('SUM(p.amount)', 'value')
      .where('p.year = :year', { year })
      .groupBy("TO_CHAR(p.\"paymentDate\"::date, 'Mon')")
      .orderBy("MIN(p.\"paymentDate\"::date)")
      .getRawMany();
  }
}

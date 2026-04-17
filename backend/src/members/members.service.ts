import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Member } from './member.entity';
import { CreateMemberDto, UpdateMemberDto } from './member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly repo: Repository<Member>,
  ) {}

  findAll(search?: string) {
    const where: any = {};
    if (search) where.name = Like(`%${search}%`);
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const member = await this.repo.findOneBy({ id });
    if (!member) throw new NotFoundException(`Member #${id} not found`);
    return member;
  }

  create(dto: CreateMemberDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateMemberDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Member deleted' };
  }

  count() {
    return this.repo.count();
  }
}

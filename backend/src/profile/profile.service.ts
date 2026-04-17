import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { UpdateProfileDto } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
  ) {}

  async get() {
    // Always work with a single profile row (id=1), seed it if missing
    let profile = await this.repo.findOneBy({ id: 1 });
    if (!profile) {
      profile = this.repo.create({ id: 1 });
      await this.repo.save(profile);
    }
    return profile;
  }

  async update(dto: UpdateProfileDto) {
    await this.get(); // ensure row exists
    await this.repo.update(1, dto);
    return this.get();
  }
}

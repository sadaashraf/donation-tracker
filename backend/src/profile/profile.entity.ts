import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Alex Johnson' })
  name: string;

  @Column({ default: 'alex.johnson@email.com' })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 'Pro Plan' })
  plan: string;

  @Column({ default: '2023' })
  memberSince: string;
}

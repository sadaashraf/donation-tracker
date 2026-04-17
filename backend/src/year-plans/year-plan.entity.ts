import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('year_plans')
export class YearPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  year: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amountRequired: number;

  @CreateDateColumn()
  createdAt: Date;
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MembersModule } from './members/members.module';
import { PaymentsModule } from './payments/payments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProfileModule } from './profile/profile.module';
import { YearPlansModule } from './year-plans/year-plans.module';
import { Member } from './members/member.entity';
import { Payment } from './payments/payment.entity';
import { Profile } from './profile/profile.entity';
import { YearPlan } from './year-plans/year-plan.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'MMS_db'),
        entities: [Member, Payment, Profile, YearPlan],
        synchronize: true,
      }),
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    MembersModule,
    PaymentsModule,
    DashboardModule,
    ProfileModule,
    YearPlansModule,
  ],
})
export class AppModule {}

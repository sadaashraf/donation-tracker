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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = process.env.NODE_ENV === 'production';
        return {
          type: 'postgres',
          url: isProduction ? process.env.DATABASE_URL : undefined,
          host: !isProduction ? config.get('DB_HOST', 'localhost') : undefined,
          port: !isProduction ? config.get<number>('DB_PORT', 5432) : undefined,
          username: !isProduction ? config.get('DB_USERNAME', 'postgres') : undefined,
          password: !isProduction ? config.get('DB_PASSWORD', 'postgres') : undefined,
          database: !isProduction ? config.get('DB_NAME', 'MMS_db') : undefined,
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
        }
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    MembersModule,
    PaymentsModule,
    DashboardModule,
    ProfileModule,
    YearPlansModule,
  ],
})
export class AppModule { }

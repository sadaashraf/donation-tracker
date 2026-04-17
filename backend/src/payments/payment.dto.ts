import { IsString, IsNumberString, IsDateString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumberString()
  memberId: string;

  @IsString()
  year: string;

  @IsNumberString()
  amount: string;

  @IsDateString()
  paymentDate: string;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumberString()
  amount?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}

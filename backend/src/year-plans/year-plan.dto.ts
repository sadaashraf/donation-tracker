import { IsString, IsNumberString } from 'class-validator';

export class CreateYearPlanDto {
  @IsString()
  year: string;

  @IsNumberString()
  amountRequired: string;
}

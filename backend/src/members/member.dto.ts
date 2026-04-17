import { IsString, IsOptional } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

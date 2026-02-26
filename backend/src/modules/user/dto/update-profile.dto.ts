import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

const emptyToUndefined = ({ value }: { value: unknown }) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Transform(emptyToUndefined)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(emptyToUndefined)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(emptyToUndefined)
  company?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(emptyToUndefined)
  userTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(emptyToUndefined)
  useCase?: string;

  @IsOptional()
  @IsString()
  @Transform(emptyToUndefined)
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(emptyToUndefined)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(emptyToUndefined)
  businessType?: string;
}

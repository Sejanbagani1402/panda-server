import { IsString, IsOptional } from 'class-validator';

export class CompleteOnboardingDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  preferences?: Record<string, any>;
}

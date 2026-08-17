import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CompleteOnboardingDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  preferences?: Record<string, any>;
}

import { IsOptional } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  preferences?: Record<string, any>;
}

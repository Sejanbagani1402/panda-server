import { IsOptional, IsEnum, IsString } from 'class-validator';
import { GoalStatus } from './create-goal.dto';
import { Type } from 'class-transformer';

export class QueryGoalsDto {
  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum QueryFilterOperator {
  Equals = 'eq',
  NotEquals = 'ne',
  GreaterThan = 'gt',
  GreaterThanOrEquals = 'gte',
  LessThan = 'lt',
  LessThanOrEquals = 'lte',
  Like = 'like',
  NotLike = 'not_like',
}

export type QueryFilterValue = string | number | boolean;

export type QueryFilterCondition = {
  operator: QueryFilterOperator;
  value: QueryFilterValue;
};

export type QueryFilterFields = {
  [key: string]: QueryFilterCondition | QueryFilterCondition[] | undefined;
};

export enum OrderTime {
  UPCOMING = 'upcoming',
  PAST = 'past',
}

export class GetOrdersQuery {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  filterFields?: QueryFilterFields;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortDirection?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  time?: OrderTime;
}

import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FindOutput<T> {
  result: T[];
  total: number;
}

export class FindInput<F> {
  @IsOptional()
  @IsString()
  limit: string;
  @IsOptional()
  @IsString()
  offset: string;
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: string;
  @IsOptional()
  @IsString()
  sortBy: string;
  @IsOptional()
  @IsObject()
  filters: Partial<F>[];
}

export class FindMapper<F> {
  @Expose()
  @Transform(function ({ obj }) {
    const keys = Object.keys(obj);
    let transformedValue = [];
    keys.forEach((key) => {
      if (key !== 'filters' && key !== 'limit' && key !== 'offset' && key !== 'sortOrder' && key !== 'sortBy') {
        obj[key].split(',').forEach((item) => {
          transformedValue = [...transformedValue, { [key]: item }];
        });
        delete obj[key];
      }
    });
    return transformedValue;
  })
  filters: Partial<F>[];
  @Expose()
  limit: string;
  @Expose()
  offset: string;
  @Expose()
  sortOrder: string;
  @Expose()
  sortBy: string;
}

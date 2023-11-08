import { Like } from 'typeorm';
import { FindInput, SortOrder } from './shared.models';

export const setFindQuery = <F>(criteria: FindInput<F>): any => {
  const { limit, offset, sortOrder, sortBy, filters } = criteria;

  return {
    skip: offset ?? 0,
    take: limit ?? 10,
    ...(sortBy &&
      sortOrder && {
        order: {
          [sortBy]: sortOrder ?? SortOrder.ASC,
        },
      }),
    where: convertFiltersWhereQueryToLike<F>(filters),
  };
};
export const convertFiltersWhereQueryToLike = <F>(filters: Partial<F>[]): any => {
  if (filters && filters.length > 0) {
    return filters.map((filter) => ({ [Object.keys(filter)[0]]: Like(`%${filter[Object.keys(filter)[0]]}%`) }));
  } else {
    return {};
  }
};

import { QueryListQuery, Sort } from '@/interfaces/request.interface';
import { createParamDecorator } from '@nestjs/common';

export const QueryList = createParamDecorator(
  (data, req): QueryListQuery<any> => {
    const { page, pageSize, sortKey, sortType, ...query } = req.query;
    let newSort = Sort.DEFAULT;
    if (sortType === 'ascend') {
      newSort = Sort.ASC;
    }
    if (sortType === 'descend') {
      newSort = Sort.DESC;
    }
    return {
      skip: (Number(page || 1) - 1) * Number(pageSize || 20),
      take: Number(pageSize || 20),
      sort: {
        key: sortKey,
        value: newSort,
      },
      query,
    };
  },
);

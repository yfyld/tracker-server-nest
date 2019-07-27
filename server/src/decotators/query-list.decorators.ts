import { createParamDecorator } from '@nestjs/common';
import { QueryListResult } from '@/interfaces/request.interface';

export const QueryList = createParamDecorator(
  (data, req): QueryListResult<any> => {
    const { page, pageSize, sort, ...query } = req.query;
    return {
      skip: (Number(page || 1) - 1) * Number(pageSize || 20),
      take: Number(pageSize || 20),
      sort,
      query,
    };
  },
);

import * as lodash from 'lodash';
import * as HTTP from '@/constants/http.constant';
import { SetMetadata, CacheKey } from '@nestjs/common';

// 缓存器配置
interface ICacheOption {
  ttl?: number;
  key?: string;
}

/**
 * 统配构造器
 * @function HttpCache
 * @description 两种用法
 * @example @HttpCache(CACHE_KEY, 60 * 60)
 * @example @HttpCache({ key: CACHE_KEY, ttl: 60 * 60 })
 */
export function HttpCache(option: ICacheOption): MethodDecorator;
export function HttpCache(key: string, ttl?: number): MethodDecorator;
export function HttpCache(...args) {
  const option = args[0];
  const isOption = (value): value is ICacheOption => lodash.isObject(value);
  const key: string = isOption(option) ? option.key : option;
  const ttl: number = isOption(option) ? option.ttl : args[1] || null;
  return (_, __, descriptor: PropertyDescriptor) => {
    if (key) {
      CacheKey(key)(descriptor.value);
    }
    if (ttl) {
      SetMetadata(HTTP.HTTP_CACHE_TTL_METADATA, ttl)(descriptor.value);
    }
    return descriptor;
  };
}

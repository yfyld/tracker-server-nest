import { Observable } from 'rxjs';
import { CacheInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
export declare class HttpCacheInterceptor extends CacheInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>>;
    trackBy(context: ExecutionContext): string | undefined;
}

import { tap } from 'rxjs/operators';
import { Injectable, ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { stringify } from 'circular-json-es6';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpRequest = context.switchToHttp().getRequest();
    return next.handle().pipe(
      tap(httpResponse => {
        // console.info(`request:${this.requestFormat(httpRequest)}   response:${this.responseFormat(httpResponse)}`);
      })
    );
  }

  requestFormat(httpRequest: any): string {
    return stringify({
      url: httpRequest.url,
      method: httpRequest.method,
      params: httpRequest.params,
      query: httpRequest.query,
      body: httpRequest.body,
      httpVersion: httpRequest.httpVersion,
      headers: httpRequest.headers,
      route: httpRequest.route
    });
  }

  responseFormat(httpResponse: any): string {
    return stringify(httpResponse);
  }
}

import * as lodash from 'lodash';
import { isDevMode } from '@/app.environment';
import { EHttpStatus, THttpErrorResponse, TExceptionOption, TMessage } from '@/interfaces/http.interface';
import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { stringify } from 'circular-json-es6';

/**
 * @class HttpExceptionFilter
 * @classdesc 拦截全局抛出的所有异常，同时任何错误将在这里被规范化输出 THttpErrorResponse
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();
    const status = (exception.getStatus && exception.getStatus()) || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorOption: TExceptionOption = exception.getResponse
      ? (exception.getResponse() as TExceptionOption)
      : exception;
    const isString = (value): value is TMessage => lodash.isString(value);
    const errMessage = isString(errorOption) ? errorOption : errorOption.message;
    const errorInfo = isString(errorOption) ? null : errorOption.error;
    const parentErrorInfo = errorInfo ? String(errorInfo) : null;
    const isChildrenError = errorInfo && errorInfo.status && errorInfo.message;
    const resultError = (isChildrenError && errorInfo.message) || parentErrorInfo;
    const resultStatus = isChildrenError ? errorInfo.status : status;
    const data: THttpErrorResponse = {
      status: resultStatus,
      message: errMessage,
      error: resultError,
      debug: isDevMode ? exception.stack : null
    };
    // 对默认的 404 进行特殊处理
    if (status === HttpStatus.NOT_FOUND) {
      data.error = `资源不存在`;
      data.message = `接口 ${request.method} -> ${request.url} 无效`;
    }

    console.error(`request:${this.requestFormat(request)}   response:${stringify(data)}`);

    return response.status(HttpStatus.OK).jsonp(data);
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
}

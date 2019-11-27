/// <reference types="mongoose-paginate" />
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PaginateResult } from 'mongoose';
import { NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { THttpSuccessResponse, IHttpResultPaginate } from '@/interfaces/http.interface';
export declare function transformDataToPaginate<T>(data: PaginateResult<T>, request?: any): IHttpResultPaginate<T[]>;
export declare class TransformInterceptor<T> implements NestInterceptor<T, THttpSuccessResponse<T>> {
    private readonly reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<THttpSuccessResponse<T>>;
}

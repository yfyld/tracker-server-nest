export declare enum EHttpStatus {
    Error = 400,
    Success = 200
}
export declare type TMessage = string;
export declare type TExceptionOption = TMessage | {
    message: TMessage;
    error?: any;
};
export interface IHttpResultPaginate<T> {
    list: T;
    totalCount: number;
}
export interface IHttpResponseBase {
    status: EHttpStatus;
    message: TMessage;
}
export declare type THttpErrorResponse = IHttpResponseBase & {
    error: any;
    debug?: string;
};
export declare type THttpSuccessResponse<T> = IHttpResponseBase & {
    result: T | IHttpResultPaginate<T>;
};
export declare type THttpResponse<T> = THttpErrorResponse | THttpSuccessResponse<T>;

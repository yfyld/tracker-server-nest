import { UnauthorizedException } from '@nestjs/common';
import { TMessage } from '@/interfaces/http.interface';
export declare class HttpUnauthorizedError extends UnauthorizedException {
    constructor(message?: TMessage, error?: any);
}

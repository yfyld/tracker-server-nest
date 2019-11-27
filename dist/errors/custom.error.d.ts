import { HttpException, HttpStatus } from '@nestjs/common';
import { TExceptionOption } from '@/interfaces/http.interface';
export declare class CustomError extends HttpException {
    constructor(options: TExceptionOption, statusCode?: HttpStatus);
}

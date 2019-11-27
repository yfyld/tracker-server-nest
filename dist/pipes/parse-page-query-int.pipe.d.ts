import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ParsePageQueryIntPipe implements PipeTransform<string> {
    keys: string[];
    constructor(keys?: any[]);
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
}

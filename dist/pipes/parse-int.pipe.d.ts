import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ParseIntPipe implements PipeTransform<string> {
    keys: string[];
    constructor(keys?: any[]);
    transform(value: string | Object, metadata: ArgumentMetadata): Promise<Object>;
}

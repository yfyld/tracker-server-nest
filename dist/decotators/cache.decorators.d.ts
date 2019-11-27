interface ICacheOption {
    ttl?: number;
    key?: string;
}
export declare function HttpCache(option: ICacheOption): MethodDecorator;
export declare function HttpCache(key: string, ttl?: number): MethodDecorator;
export {};

export interface UaDetail {
    browser: string;
    browserVersion: string;
    deviceManufacturer: string;
    deviceModel: string;
    deviceType: string;
    engine: string;
    engineVersion: string;
    os: string;
    osVersion: string;
}
export declare class UaService {
    constructor();
    parse(ua: string): UaDetail;
}

import { HttpService } from '@nestjs/common';
export declare type IP = string;
export interface IIPDetail {
    city: string;
    country: string;
    region: string;
    isp: string;
    ip: string;
}
export declare class IpService {
    private readonly httpService;
    constructor(httpService: HttpService);
    private queryIpByTaobao;
    private queryIpByGeo;
    query(ip: IP): Promise<IIPDetail>;
}

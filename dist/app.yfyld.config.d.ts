import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
export declare const APP: {
    port: number;
    version: string;
};
export declare const AUTH: {
    jwtTokenSecret: string;
    expiresIn: number;
    defaultPassword: string;
    data: {
        username: string;
        roles: any[];
    };
};
export declare const CROSS_DOMAIN: {
    allowedOrigins: any[];
};
export declare const BULLCONFIG: {};
export declare const CCONFIG: {};
export declare const MULTER_OPTIONS: {
    fileSize: number;
    path: string;
};
export declare const ALARMCONFIG: {
    alarmWithlevelType: number[];
};
export declare const STAT_USER_NUM_INTERVAL = 30000;
export declare const ALARM_INTERVAL = 30000;
export declare const GENERATE_IMG_CRON = "0 0 3 * *";
export declare const BASE_URL: {
    webUrl: string;
    serverUrl: string;
};
export declare const ORMCONFIG: MysqlConnectionOptions;
export declare const REDIS: {
    host: string;
    port: number;
    ttl: any;
    defaultCacheTTL: number;
};
export declare const ES_CONFIG: {
    host: string;
    log: string;
};

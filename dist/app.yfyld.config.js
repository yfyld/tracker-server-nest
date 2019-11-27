"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.APP = {
    port: 3007,
    version: '1.0.0'
};
exports.AUTH = {
    jwtTokenSecret: 'I am quiet handsome man',
    expiresIn: 99999999999999,
    defaultPassword: '123456',
    data: { username: 'root', roles: [] }
};
exports.CROSS_DOMAIN = {
    allowedOrigins: []
};
exports.BULLCONFIG = {};
exports.CCONFIG = {};
exports.MULTER_OPTIONS = {
    fileSize: 10000000,
    path: path.join(__dirname, 'publics/uploads')
};
exports.ALARMCONFIG = {
    alarmWithlevelType: [1, 10, 100]
};
exports.STAT_USER_NUM_INTERVAL = 30000;
exports.ALARM_INTERVAL = 30000;
exports.GENERATE_IMG_CRON = '0 0 3 * *';
exports.BASE_URL = {
    webUrl: 'http://trycatch.yfyld.com',
    serverUrl: 'http://trycatch.yfyld.com/api'
};
exports.ORMCONFIG = {
    type: 'mysql',
    host: 'mysql',
    port: 3306,
    username: 'root',
    password: '342531',
    database: 'trycatch',
    entities: [__dirname + '/**/*.model{.ts,.js}'],
    synchronize: true
};
exports.REDIS = {
    host: 'redis',
    port: 6379,
    ttl: null,
    defaultCacheTTL: 60 * 60 * 24
};
exports.ES_CONFIG = {
    host: 'trycatch.yfyld.com:9006',
    log: 'trace'
};
//# sourceMappingURL=app.yfyld.config.js.map
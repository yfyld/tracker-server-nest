"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.APP = {
    port: 7001,
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
exports.GENERATE_IMG_CRON = '0 0 11 * *';
exports.BASE_URL = {
    webUrl: 'http://127.0.0.1:5000',
    serverUrl: 'http://127.0.0.1:7001'
};
exports.ORMCONFIG = {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3337,
    username: 'root',
    password: '342531',
    database: 'trycatch',
    entities: [__dirname + '/**/*.model{.ts,.js}'],
    synchronize: true
};
exports.MONGODB = {
    url: `mongodb://127.0.0.1:27017/minder`,
    username: 'yfyld',
    password: '342531',
    limit: 20
};
exports.REDIS = {
    host: '127.0.0.1',
    port: 6667,
    ttl: null,
    defaultCacheTTL: 60 * 60 * 24
};
exports.ES_CONFIG = {
    host: 'yfyld.cn:9006',
    log: 'trace'
};
//# sourceMappingURL=app.production.config.js.map
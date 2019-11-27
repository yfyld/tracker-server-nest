"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("./../../app.config");
const nestjs_redis_1 = require("nestjs-redis");
exports.RedisModule = nestjs_redis_1.RedisModule.register({
    host: app_config_1.REDIS.host,
    port: app_config_1.REDIS.port,
    db: 3
});
//# sourceMappingURL=redis.module.js.map
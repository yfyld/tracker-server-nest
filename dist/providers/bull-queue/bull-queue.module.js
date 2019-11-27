"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("./../../app.config");
const nest_bull_1 = require("nest-bull");
exports.BullQueueModule = nest_bull_1.BullModule.forRoot({
    options: {
        redis: {
            host: app_config_1.REDIS.host,
            port: app_config_1.REDIS.port,
            db: 1
        }
    },
    processors: []
});
//# sourceMappingURL=bull-queue.module.js.map
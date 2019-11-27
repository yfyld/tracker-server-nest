"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("@/app.config");
const typeorm_1 = require("@nestjs/typeorm");
exports.DatabaseModule = typeorm_1.TypeOrmModule.forRoot(app_config_1.ORMCONFIG);
//# sourceMappingURL=database.module.js.map
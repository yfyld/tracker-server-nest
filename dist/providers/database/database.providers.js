"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_constant_1 = require("@/constants/common.constant");
const typeorm_1 = require("typeorm");
const app_config_1 = require("@/app.config");
exports.databaseProviders = [
    {
        provide: common_constant_1.DB_CONNECTION_TOKEN,
        useFactory: () => __awaiter(this, void 0, void 0, function* () { return yield typeorm_1.createConnection(app_config_1.ORMCONFIG); })
    }
];
//# sourceMappingURL=database.providers.js.map
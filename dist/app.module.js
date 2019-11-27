"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_queue_module_1 = require("./providers/bull-queue/bull-queue.module");
const es_module_1 = require("./providers/es/es.module");
const helper_module_1 = require("./providers/helper/helper.module");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const user_module_1 = require("./modules/user/user.module");
const project_module_1 = require("./modules/project/project.module");
const common_module_1 = require("./modules/common/common.module");
const cors_middleware_1 = require("./middlewares/cors.middleware");
const database_module_1 = require("./providers/database/database.module");
const permission_guard_1 = require("./guards/permission.guard");
const metadata_module_1 = require("./modules/metadata/metadata.module");
const board_module_1 = require("./modules/board/board.module");
const report_module_1 = require("./modules/report/report.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(cors_middleware_1.CorsMiddleware).forRoutes('*');
    }
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DatabaseModule,
            user_module_1.UserModule,
            project_module_1.ProjectModule,
            common_module_1.CommonModule,
            helper_module_1.HelperModule,
            es_module_1.EsModule,
            bull_queue_module_1.BullQueueModule,
            report_module_1.ReportModule,
            board_module_1.BoardModule,
            metadata_module_1.MetadataModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [permission_guard_1.PermissionsGuard]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
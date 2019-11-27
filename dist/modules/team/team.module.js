"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const team_controller_1 = require("./team.controller");
const team_service_1 = require("./team.service");
const team_model_1 = require("./team.model");
const typeorm_1 = require("@nestjs/typeorm");
let TeamModule = class TeamModule {
};
TeamModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([team_model_1.TeamModel])],
        providers: [team_service_1.TeamService],
        controllers: [team_controller_1.TeamController],
        exports: [team_service_1.TeamService]
    })
], TeamModule);
exports.TeamModule = TeamModule;
//# sourceMappingURL=team.module.js.map
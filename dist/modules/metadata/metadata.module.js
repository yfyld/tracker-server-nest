"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const metadata_controller_1 = require("./metadata.controller");
const metadata_service_1 = require("./metadata.service");
const metadata_model_1 = require("./metadata.model");
const typeorm_1 = require("@nestjs/typeorm");
const project_model_1 = require("../project/project.model");
let MetadataModule = class MetadataModule {
};
MetadataModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([metadata_model_1.MetadataModel, metadata_model_1.MetadataTagModel, project_model_1.ProjectModel, metadata_model_1.FieldModel])],
        providers: [metadata_service_1.MetadataService],
        controllers: [metadata_controller_1.MetadataController],
        exports: [metadata_service_1.MetadataService]
    })
], MetadataModule);
exports.MetadataModule = MetadataModule;
//# sourceMappingURL=metadata.module.js.map
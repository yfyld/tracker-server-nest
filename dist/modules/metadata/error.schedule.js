"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("../../app.config");
const metadata_service_1 = require("./metadata.service");
const common_1 = require("@nestjs/common");
const nest_schedule_1 = require("nest-schedule");
let MetadataSchedule = class MetadataSchedule extends nest_schedule_1.NestSchedule {
    constructor(metadataService) {
        super();
        this.metadataService = metadataService;
    }
    intervalAlarm() {
        console.log('auto alarm');
    }
};
__decorate([
    nest_schedule_1.Interval(app_config_1.ALARM_INTERVAL),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetadataSchedule.prototype, "intervalAlarm", null);
MetadataSchedule = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [metadata_service_1.MetadataService])
], MetadataSchedule);
exports.MetadataSchedule = MetadataSchedule;
//# sourceMappingURL=error.schedule.js.map
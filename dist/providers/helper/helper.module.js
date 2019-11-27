"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_chart_service_1 = require("./helper.chart.service");
const helper_ua_service_1 = require("./helper.ua.service");
const common_1 = require("@nestjs/common");
const helper_ip_service_1 = require("./helper.ip.service");
const services = [helper_ip_service_1.IpService, helper_ua_service_1.UaService, helper_chart_service_1.ChartService];
let HelperModule = class HelperModule {
};
HelperModule = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [common_1.HttpModule],
        providers: services,
        exports: services
    })
], HelperModule);
exports.HelperModule = HelperModule;
//# sourceMappingURL=helper.module.js.map
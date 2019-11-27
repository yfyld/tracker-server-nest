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
const common_1 = require("@nestjs/common");
const UA = require("ua-device");
let UaService = class UaService {
    constructor() { }
    parse(ua) {
        try {
            const result = UA(ua);
            return {
                browser: result.browser.name,
                browserVersion: result.browser.version.original,
                deviceManufacturer: result.device.manufacturer,
                deviceModel: result.device.model,
                deviceType: result.device.type,
                engine: result.engine.name,
                engineVersion: result.engine.version.original,
                os: result.os.name,
                osVersion: result.os.version.original
            };
        }
        catch (e) {
            return {
                browser: '未知',
                browserVersion: '未知',
                deviceManufacturer: '未知',
                deviceModel: '未知',
                deviceType: '未知',
                engine: '未知',
                engineVersion: '未知',
                os: '未知',
                osVersion: '未知'
            };
        }
    }
};
UaService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], UaService);
exports.UaService = UaService;
//# sourceMappingURL=helper.ua.service.js.map
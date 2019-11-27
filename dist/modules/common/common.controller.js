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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = require("@nestjs/swagger");
const app_config_1 = require("./../../app.config");
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const http_decotator_1 = require("@/decotators/http.decotator");
const platform_express_1 = require("@nestjs/platform-express");
const fs_1 = require("fs");
const path_1 = require("path");
const auth_guard_1 = require("@/guards/auth.guard");
let CommonController = class CommonController {
    fileUpload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                url: app_config_1.BASE_URL.serverUrl + '/public/uploads/' + file.filename,
                filename: file.originalname
            };
        });
    }
};
__decorate([
    swagger_1.ApiOperation({ title: '上传文件', description: '' }),
    http_decotator_1.HttpProcessor.handle('上传文件'),
    common_1.Post('/upload'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        limits: {
            fileSize: app_config_1.MULTER_OPTIONS.fileSize
        },
        storage: multer_1.diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = app_config_1.MULTER_OPTIONS.path;
                if (!fs_1.existsSync(uploadPath)) {
                    fs_1.mkdirSync(uploadPath);
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                cb(null, `${file.fieldname}-${Date.now()}${path_1.extname(file.originalname)}`);
            }
        })
    })),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "fileUpload", null);
CommonController = __decorate([
    swagger_1.ApiUseTags('公共'),
    common_1.Controller('common'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard)
], CommonController);
exports.CommonController = CommonController;
//# sourceMappingURL=common.controller.js.map
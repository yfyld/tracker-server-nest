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
const parse_int_pipe_1 = require("./../../pipes/parse-int.pipe");
const parse_page_query_int_pipe_1 = require("./../../pipes/parse-page-query-int.pipe");
const query_list_decorators_1 = require("@/decotators/query-list.decorators");
const http_decotator_1 = require("@/decotators/http.decotator");
const board_dto_1 = require("./board.dto");
const board_service_1 = require("./board.service");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("@/guards/auth.guard");
const user_decorators_1 = require("@/decotators/user.decorators");
let BoardController = class BoardController {
    constructor(boardService) {
        this.boardService = boardService;
    }
    addBoard(body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.boardService.addBoard(body, user);
        });
    }
    updateBoard(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.boardService.updateBoard(body);
        });
    }
    getBoards(query, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.boardService.getBoards(query, user);
        });
    }
    getBoardInfo(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.boardService.getBoardInfo(query);
        });
    }
    appendReport(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
};
__decorate([
    http_decotator_1.HttpProcessor.handle('新增看板'),
    common_1.Post('/'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()), __param(1, user_decorators_1.Auth()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [board_dto_1.AddBoardDto, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "addBoard", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('编辑看板'),
    common_1.Put('/'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [board_dto_1.UpdateBoardDto]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "updateBoard", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('看板列表'),
    common_1.Get('/'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, query_list_decorators_1.QueryList(new parse_page_query_int_pipe_1.ParsePageQueryIntPipe(['projectId', 'status']))),
    __param(1, user_decorators_1.Auth()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getBoards", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('看板详情'),
    common_1.Get('/info'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Query(new parse_int_pipe_1.ParseIntPipe(['projectId', 'id']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [board_dto_1.QueryBoardInfoDto]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getBoardInfo", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('添加报表到看板'),
    common_1.Post('/append'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [board_dto_1.AddBoardReportDto]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "appendReport", null);
BoardController = __decorate([
    swagger_1.ApiUseTags('看板'),
    common_1.Controller('board'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [board_service_1.BoardService])
], BoardController);
exports.BoardController = BoardController;
//# sourceMappingURL=board.controller.js.map
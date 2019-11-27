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
const report_model_1 = require("./report.model");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const board_model_1 = require("../board/board.model");
let ReportService = class ReportService {
    constructor(reportModel, boardModel) {
        this.reportModel = reportModel;
        this.boardModel = boardModel;
    }
    addReport(body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const reportInfo = Object.assign({}, body, { board: null, creator: user, data: JSON.stringify(body.data) });
            if (body.boardId) {
                var board = yield this.boardModel.findOne({
                    where: {
                        id: body.boardId,
                        projectId: body.projectId
                    }
                });
                reportInfo.board = board;
            }
            const report = this.reportModel.create(reportInfo);
            yield this.reportModel.save(report);
            if (board) {
                const layout = board.layout ? JSON.parse(board.layout) : [];
                board.layout = JSON.stringify(layout.concat({ y: Infinity, x: 0, w: 12, h: 9, i: String(report.id) }));
                this.boardModel.save(board);
            }
            return;
        });
    }
    getReports(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchBody = {
                skip: query.skip,
                take: query.take,
                where: {},
                order: {}
            };
            if (query.sort.key) {
                searchBody.order[query.sort.key] = query.sort.value;
            }
            if (typeof query.query.status !== 'undefined') {
                searchBody.where.status = query.query.status;
            }
            if (!query.query.inBoard) {
                searchBody.where.boardId = typeorm_1.IsNull();
            }
            if (typeof query.query.boardId !== 'undefined') {
                searchBody.where.boardId = query.query.boardId;
            }
            if (typeof query.query.name !== 'undefined') {
                searchBody.where.name = typeorm_1.Like(`%${query.query.name || ''}%`);
            }
            const [report, totalCount] = yield this.reportModel.findAndCount(searchBody);
            return {
                totalCount,
                list: report
            };
        });
    }
    updateReport(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateBody = {};
            if (body.actionType === 'LEVEL') {
                updateBody.level = body.level;
            }
            else if (body.actionType === 'STATUS') {
                updateBody.status = body.status;
            }
            else {
                updateBody.guarder = { id: body.guarderId };
            }
            yield this.reportModel
                .createQueryBuilder()
                .update()
                .set(updateBody)
                .where('id IN (:...reportIds)', { reportIds: body.reportIds })
                .execute();
            return;
        });
    }
    deleteReport(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield this.reportModel.findOne(id);
            yield this.reportModel.remove(report);
            return;
        });
    }
};
ReportService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(report_model_1.ReportModel)),
    __param(1, typeorm_2.InjectRepository(board_model_1.BoardModel)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], ReportService);
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map
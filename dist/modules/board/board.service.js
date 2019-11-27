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
const report_model_1 = require("./../report/report.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const board_model_1 = require("./board.model");
const common_1 = require("@nestjs/common");
let BoardService = class BoardService {
    constructor(boardModel, reportModel) {
        this.boardModel = boardModel;
        this.reportModel = reportModel;
    }
    addBoard(body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = this.boardModel.create(Object.assign({ creator: user }, body, { layout: JSON.stringify(body.layout) }));
            yield this.boardModel.save(board);
            return;
        });
    }
    updateBoard(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let board = yield this.boardModel.findOne({
                where: {
                    id: body.id,
                    projectId: body.projectId
                }
            });
            board = Object.assign({}, board, body, { layout: JSON.stringify(body.layout) });
            yield this.boardModel.save(board);
            return;
        });
    }
    getBoards(query, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchBody = {
                skip: query.skip,
                take: query.take,
                where: {}
            };
            if (typeof query.query.status !== 'undefined') {
                searchBody.where.status = query.query.status;
            }
            if (typeof query.query.projectId !== 'undefined') {
                searchBody.where.projectId = query.query.projectId;
            }
            if (typeof query.query.isPublic !== 'undefined') {
                searchBody.where.isPublic = query.query.isPublic;
            }
            else {
                searchBody.where.creator = { id: user.id };
            }
            const [boards, totalCount] = yield this.boardModel.findAndCount(searchBody);
            return {
                totalCount,
                list: boards
            };
        });
    }
    getBoardInfo(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const boardInfo = yield this.boardModel.findOne({ where: { id: query.id, project: { id: query.projectId } } });
            if (!boardInfo.layout) {
                boardInfo.layout = [];
                return Object.assign({}, boardInfo, { reportList: [] });
            }
            const layout = JSON.parse(boardInfo.layout);
            boardInfo.layout = layout;
            const reportIds = layout.map(item => Number(item.i));
            const reportList = yield this.reportModel
                .createQueryBuilder('')
                .where('id IN (:...reportIds) ', {
                reportIds
            })
                .getMany();
            return Object.assign({}, boardInfo, { reportList });
        });
    }
};
BoardService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(board_model_1.BoardModel)),
    __param(1, typeorm_1.InjectRepository(report_model_1.ReportModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BoardService);
exports.BoardService = BoardService;
//# sourceMappingURL=board.service.js.map
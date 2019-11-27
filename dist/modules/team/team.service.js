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
const team_model_1 = require("./team.model");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let TeamService = class TeamService {
    constructor(teamModel) {
        this.teamModel = teamModel;
    }
    addTeam(body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = this.teamModel.create(Object.assign({}, body, { creator: user, data: JSON.stringify(body.data) }));
            yield this.teamModel.save(team);
            return;
        });
    }
    getTeams(query) {
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
            if (typeof query.query.name !== 'undefined') {
                searchBody.where.name = typeorm_1.Like(`%${query.query.name || ''}%`);
            }
            const [team, totalCount] = yield this.teamModel.findAndCount(searchBody);
            return {
                totalCount,
                list: team
            };
        });
    }
    updateTeam(body) {
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
            yield this.teamModel
                .createQueryBuilder()
                .update()
                .set(updateBody)
                .where('id IN (:...teamIds)', { teamIds: body.teamIds })
                .execute();
            return;
        });
    }
    deleteTeam(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield this.teamModel.findOne(id);
            yield this.teamModel.remove(team);
            return;
        });
    }
};
TeamService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(team_model_1.TeamModel)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], TeamService);
exports.TeamService = TeamService;
//# sourceMappingURL=team.service.js.map
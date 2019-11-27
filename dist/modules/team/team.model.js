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
const typeorm_1 = require("typeorm");
const user_model_1 = require("../user/user.model");
let TeamModel = class TeamModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], TeamModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TeamModel.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TeamModel.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToMany(type => user_model_1.UserModel),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], TeamModel.prototype, "members", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_model_1.UserModel, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", user_model_1.UserModel)
], TeamModel.prototype, "creator", void 0);
TeamModel = __decorate([
    typeorm_1.Entity()
], TeamModel);
exports.TeamModel = TeamModel;
//# sourceMappingURL=team.model.js.map
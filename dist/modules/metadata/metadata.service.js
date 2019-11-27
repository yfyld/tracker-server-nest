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
const metadata_model_1 = require("./metadata.model");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const bad_request_error_1 = require("@/errors/bad-request.error");
let MetadataService = class MetadataService {
    constructor(metadataModel, metadataTagModel, fieldModel) {
        this.metadataModel = metadataModel;
        this.metadataTagModel = metadataTagModel;
        this.fieldModel = fieldModel;
    }
    getFields(query) {
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
            if (query.query.name) {
                searchBody.where.name = typeorm_1.Like(`%${query.query.name || ''}%`);
            }
            if (typeof query.query.status !== 'undefined') {
                searchBody.where.status = query.query.status;
            }
            const [fields, totalCount] = yield this.fieldModel.findAndCount(searchBody);
            return {
                totalCount,
                list: fields
            };
        });
    }
    getActiveFields(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = yield this.fieldModel.find();
            return fields;
        });
    }
    getMetadataList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchBody = {
                skip: query.skip,
                take: query.take,
                where: {
                    name: typeorm_1.Like(`%${query.query.name || ''}%`)
                },
                order: {}
            };
            let { sort, query: { status, type } } = query;
            if (sort.key) {
                searchBody.order[sort.key] = sort.value;
            }
            if (typeof status !== 'undefined') {
                searchBody.where.status = status;
            }
            if (type && type.length) {
                searchBody.where.type = typeorm_1.In(type);
            }
            console.log('searchBody', searchBody);
            const [metadata, totalCount] = yield this.metadataModel.findAndCount(Object.assign({}, searchBody, { relations: ['tags'] }));
            return {
                totalCount,
                list: metadata
            };
        });
    }
    addMetadata(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId, tags, newTags } = body;
            const oldMetadata = yield this.metadataModel.findOne({
                code: body.code,
                projectId
            });
            if (oldMetadata) {
                throw new bad_request_error_1.HttpBadRequestError('元数据code重复');
            }
            const metadataTags = yield this.metadataTagModel.findByIds(tags);
            if (newTags && newTags.length) {
                const newMetadataTagModels = [];
                newTags.forEach(item => {
                    newMetadataTagModels.push(this.metadataTagModel.create({ name: item, project: { id: projectId } }));
                });
                const newMetadataTags = yield this.metadataTagModel.save(newMetadataTagModels);
                metadataTags.push(...newMetadataTags);
            }
            const metadata = this.metadataModel.create(Object.assign({}, body, { tags: [] }));
            metadata.tags.push(...metadataTags);
            yield this.metadataModel.save(metadata);
            return;
        });
    }
    updateMetadata(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let metadata = yield this.metadataModel.findOne(body.id);
            const metadataTags = yield this.metadataTagModel.findByIds(body.tags);
            if (body.newTags && body.newTags.length) {
                const newMetadataTagModels = [];
                body.newTags.forEach(item => {
                    newMetadataTagModels.push(this.metadataTagModel.create({ name: item, project: { id: body.projectId } }));
                });
                const newMetadataTags = yield this.metadataTagModel.save(newMetadataTagModels);
                metadataTags.push(...newMetadataTags);
            }
            metadata = Object.assign({}, metadata, body, { tags: [] });
            metadata.tags.push(...metadataTags);
            yield this.metadataModel.save(metadata);
            return;
        });
    }
    deleteMetadata(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = yield this.metadataModel.findOne(id);
            yield this.metadataModel.remove(metadata);
            return;
        });
    }
    enableMetadata(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let metadata = yield this.metadataModel.findOne(id);
            metadata = Object.assign({}, metadata, { status: 1 });
            yield this.metadataModel.save(metadata);
            return;
        });
    }
    disableMetadata(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let metadata = yield this.metadataModel.findOne(id);
            metadata = Object.assign({}, metadata, { status: 0 });
            yield this.metadataModel.save(metadata);
            return;
        });
    }
    addMetadataTag(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldMetadata = yield this.metadataTagModel.findOne({
                name: body.name,
                project: { id: body.projectId }
            });
            if (oldMetadata) {
                throw new bad_request_error_1.HttpBadRequestError('标签已经存在');
            }
            const metadata = this.metadataTagModel.create(Object.assign({}, body, { project: { id: body.projectId } }));
            yield this.metadataTagModel.save(metadata);
            return;
        });
    }
    getMetadataTags(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchBody = {
                skip: query.skip,
                take: query.take,
                where: { projectId: query.query.projectId },
                order: {}
            };
            const [metadataTag, totalCount] = yield this.metadataTagModel.findAndCount(searchBody);
            return {
                totalCount,
                list: metadataTag
            };
        });
    }
};
MetadataService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(metadata_model_1.MetadataModel)),
    __param(1, typeorm_2.InjectRepository(metadata_model_1.MetadataTagModel)),
    __param(2, typeorm_2.InjectRepository(metadata_model_1.FieldModel)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], MetadataService);
exports.MetadataService = MetadataService;
//# sourceMappingURL=metadata.service.js.map
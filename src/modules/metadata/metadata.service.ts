import { EnumModel } from './enum.model';
import { BaseUserDto } from './../user/user.dto';
import { UserModel } from './../user/user.model';
import { ProjectModel } from './../project/project.model';
import { ListData } from './../../interfaces/request.interface';
import { IEventAttr } from './metadata.interface';
import { EVENT_ATTRS } from './../../constants/event.constant';
import {
  QueryMetadataListDto,
  AddMetadataDto,
  UpdateMetadataDto,
  QueryFieldListDto,
  AddMetadataTagDto,
  QueryMetadataTagListDto,
  EventAttrsListDto,
  UpdateMetadataTagDto,
  GetEventAttrDto,
  UpdateMetadataBatchDto,
  UpdateMetadataLogDto,
  GetMetadataInfoDto,
  AddMetadataByKaerDto
} from './metadata.dto';

import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { HttpBadRequestError } from '@/errors/bad-request.error';
import { SlsService } from '@/providers/sls/sls.service';
import { RedisService } from 'nestjs-redis';
import { XlsxService } from '@/providers/xlsx/xlsx.service';

import * as path from 'path';
import * as lodash from 'lodash';

import { Readable } from 'typeorm/platform/PlatformTools';

import { ModuleService } from '../module/module.service';
import Utils from '@/utils/utils';
import { ModuleModel } from '../module/module.model';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(MetadataModel)
    private readonly metadataModel: Repository<MetadataModel>,

    @InjectRepository(MetadataTagModel)
    private readonly metadataTagModel: Repository<MetadataTagModel>,

    @InjectRepository(ProjectModel)
    private readonly projectModel: Repository<ProjectModel>,

    @InjectRepository(ModuleModel)
    private readonly moduleModel: Repository<ModuleModel>,
    @InjectRepository(EnumModel)
    private readonly enumModel: Repository<EnumModel>,

    private readonly httpService: HttpService,
    private readonly slsService: SlsService,
    private readonly redisService: RedisService,
    private readonly xlsxervice: XlsxService
  ) {}

  /**
   *根据code查询metadata
   *
   * @param {string} code
   * @param {number} projectId
   * @returns {Promise<MetadataModel>}
   * @memberof MetadataService
   */
  public async getMetadataByCode(code: string, projectId: number): Promise<MetadataModel> {
    let metadata = await this.metadataModel.findOne({ code, projectId });
    return metadata;
  }

  private getActionType(type: string) {
    switch (type) {
      case '页面':
        return 1;

      case '页面曝光':
        return 1;
      case '事件':
        return 0;

      case '区域曝光':
        return 2;

      case '点击':
        return 0;

      default:
        break;
    }
  }

  private getActionTypeName(type: number) {
    switch (type) {
      case 1:
        return '页面曝光';
      case 0:
        return '事件';
      case 2:
        return '区域曝光';
      default:
        return '';
    }
  }

  private async metadataListParam(query: QueryListQuery<QueryMetadataListDto>) {
    let {
      skip,
      take,
      sort: { key: sortKey, value: sortValue },
      query: {
        projectId,
        version,
        status,
        checkoutStatus,
        selfCheckoutStatus,
        type,
        name,
        code,
        tags,
        log,
        operatorType,
        pageTypes,
        modules
      }
    } = query;

    // 排序
    let orderBy: {
      [propName: string]: any;
    } = {};
    if (sortKey && sortValue) {
      orderBy[`metadata.${sortKey}`] = sortValue;
    }
    orderBy = Object.assign(orderBy, {
      'metadata.createdAt': 'DESC'
    });

    // 查询条件
    let condition: string = 'isDeleted = false';
    let params: {
      [propName: string]: any;
    } = {};

    if (projectId || query.query.projectIds) {
      if (query.query.isAssociation && projectId) {
        const projectInfo = await this.projectModel.findOne({
          where: {
            id: projectId
          },
          relations: ['associationProjects']
        });
        const associationProjectIds = projectInfo.associationProjects.map(item => item.id);
        let projectIds = query.query.projectIds
          ? query.query.projectIds
              .split(',')
              .map(item => Number(item))
              .filter(item => associationProjectIds.includes(item))
          : null;
        if (!projectIds || !projectIds.length) {
          projectIds = associationProjectIds;
          projectIds.push(projectId);
        }

        params.projectIds = projectIds;
        condition += ' and metadata.projectId in (:projectIds)';
      } else if (query.query.projectIds) {
        let projectIds = query.query.projectIds.split(',').map(item => Number(item));
        params.projectIds = projectIds;
        condition += ' and metadata.projectId in (:projectIds)';
      } else {
        condition += ' and metadata.projectId = :projectId';
      }

      params.projectId = projectId;
    }

    if (name) {
      condition += ` and metadata.name LIKE :name`;
      params.name = `%${name}%`;
    }

    if (code) {
      condition += ` and metadata.code LIKE :code `;
      params.code = `%${code}%`;
    }

    if (typeof status !== 'undefined') {
      condition += ' and metadata.status = :status';
      params.status = status;
    }

    if (typeof checkoutStatus !== 'undefined') {
      condition += ' and metadata.checkoutStatus = :checkoutStatus';
      params.checkoutStatus = checkoutStatus;
    }

    if (typeof version !== 'undefined') {
      condition += ' and metadata.version = :version';
      params.version = version;
    }

    if (typeof selfCheckoutStatus !== 'undefined') {
      condition += ' and metadata.selfCheckoutStatus = :selfCheckoutStatus';
      params.selfCheckoutStatus = selfCheckoutStatus;
    }

    if (type) {
      condition += ' and metadata.type = :type';
      params.type = type;
    }

    if (operatorType) {
      condition += ' and metadata.operatorType = :operatorType';
      params.operatorType = operatorType;
    }

    if (tags) {
      condition += ' and tag.id in (:tags)';
      params.tags = tags.split(',');
    }

    if (pageTypes) {
      condition += ' and metadata.pageType in (:pageTypes)';
      params.pageTypes = pageTypes.split(',');
    }

    if (modules) {
      condition += ' and metadata.moduleId in (:modules)';
      params.modules = modules.split(',');
    }

    if (log) {
      switch (log) {
        case 'NONE':
          condition += ` and metadata.log = 0 `;
          break;
        case 'NONE_H5':
          condition += ` and metadata.log = metadata.logByApp `;
          break;
        case 'NONE_NATIVE':
          condition += ` and metadata.logByApp = 0 `;
          break;
        case 'H5':
          condition += ` and metadata.log > 0 and metadata.log > metadata.logByApp `;
          break;
        case 'NATIVE':
          condition += ` and metadata.log > 0 and metadata.logByApp > 0 `;
          break;
        case 'ALL':
          condition += ` and metadata.log > 0 `;
          break;
        default:
          break;
      }
    }

    return {
      condition,
      params,
      skip,
      take,
      orderBy
    };
  }

  /**
   *获取metadata List
   *
   * @memberof MetadataService
   */
  public async getMetadataList(
    query: QueryListQuery<QueryMetadataListDto>,
    user: UserModel
  ): Promise<PageData<MetadataModel>> {
    const { condition, params, skip, take, orderBy } = await this.metadataListParam(query);

    let [metadata, totalCount] = await this.metadataModel
      .createQueryBuilder('metadata')
      .leftJoinAndSelect('metadata.tags', 'tag')
      .where(condition, params)
      .skip(skip)
      .take(take)
      .orderBy(orderBy)
      .getManyAndCount();

    let modules = await this.moduleModel.find();
    let moduleByIdMap = modules.reduce((total, item) => {
      total[item.id] = item.name;
      return total;
    }, {});

    let projects = await this.projectModel.find();
    let projectByIdMap = projects.reduce((total, item) => {
      total[item.id] = item.name;
      return total;
    }, {});

    metadata = metadata.map(item => {
      (item as any).module = moduleByIdMap[item.moduleId] || null;
      (item as any).projectName = projectByIdMap[item.projectId] || null;

      //是否显示日志数
      if (!(user as any).permissions.includes('METADATA_SHOW_LOG')) {
        if (item.log) {
          (item as any).log = '**' + item.log.toString().substr(-2, 2);
        }
        if (item.logByApp) {
          (item as any).logByApp = '**' + item.logByApp.toString().substr(-2, 2);
        }
        if (item.logByH5) {
          (item as any).logByH5 = '**' + item.logByH5.toString().substr(-2, 2);
        }
        if (item.recentLog) {
          (item as any).recentLog = '**' + item.recentLog.toString().substr(-2, 2);
        }
        if (item.recentLogByApp) {
          (item as any).recentLogByApp = '**' + item.recentLogByApp.toString().substr(-2, 2);
        }
        if (item.recentLogByH5) {
          (item as any).recentLogByH5 = '**' + item.recentLogByH5.toString().substr(-2, 2);
        }
      }
      return item;
    });

    return {
      totalCount,
      list: metadata
    };
  }

  /**
   * 通过 code 获取 metadata
   *
   * @memberof MetadataService
   */
  public async getMetadataInfoByCode(code: string): Promise<MetadataModel> {
    const metadata = await this.metadataModel.findOne({
      code: code,
      isDeleted: false
    });
    return metadata;
  }

  /**
   * 通过 codes 获取 metadata List
   *
   * @memberof MetadataService
   */
  public async getMetadataInfosByCodes(query: GetMetadataInfoDto): Promise<MetadataModel[]> {
    const codes = query.code.split(',');
    const undupCodes = lodash.uniq(codes);
    const metadataPromises = [];
    undupCodes.forEach(code => {
      metadataPromises.push(this.getMetadataInfoByCode(code));
    });

    const metadatas = await Promise.all(metadataPromises);
    return metadatas;
  }

  public async exportExcel(query: QueryListQuery<QueryMetadataListDto>): Promise<[Readable, number]> {
    const { condition, params, orderBy } = await this.metadataListParam(query);

    let [metadata, totalCount] = await this.metadataModel
      .createQueryBuilder('metadata')
      .leftJoinAndSelect('metadata.tags', 'tag')
      .where(condition, params)
      // .skip(skip)
      // .take(take)
      .orderBy(orderBy)
      .getManyAndCount();

    // const modules = await this.modelService.getModuleByIds(metadata.map(md => md.module));

    // const moduleMap = Utils.arrToMap(modules, ['id']);
    // const newMetadata = metadata.map(md => {
    //   return { ...md, module: moduleMap.get(md.module.toString()).name };
    // });

    try {
      var pageTypes = JSON.parse((await this.enumModel.findOne({ code: 'pagetype' })).content);
    } catch (error) {
      throw new Error('请先更新pagetype维表');
    }
    const projects = await this.projectModel.find();

    const modules = await this.moduleModel.find();

    let data = [['应用', '名称', 'code', '类型', '启用', '标签', '模块', '页面类型', '版本', '备注']];
    data = data.concat(
      metadata.map(item => {
        const pageType = pageTypes.find(i => i.value === item.pageType);
        const module = modules.find(i => i.id === item.moduleId);
        const project = projects.find(i => i.id == item.projectId);
        return [
          project ? project.name : '',
          item.name,
          item.code,
          this.getActionTypeName(item.type),
          item.status === 1 ? '是' : '否',
          item.tags.map(tag => tag.name).join(','),
          module ? module.name : '',
          pageType ? pageType.label : '',
          item.version,
          item.description
        ];
      })
    );

    const result = await this.xlsxervice.exportExcel(data);
    return result;
  }

  public async isMetaDataAssocited(moduleId: number) {
    const metadata = await this.metadataModel
      .createQueryBuilder('metadata')
      .where('moduleId = :moduleId', { moduleId })
      .getOne();
    return metadata;
  }

  public async addMetadataByKaer(body: AddMetadataByKaerDto): Promise<void> {
    const { code, pageType, moduleId, name } = body;
    const oldMetadata = await this.metadataModel.findOne({
      code: code
    });

    if (oldMetadata && oldMetadata.projectId !== 35) {
      return;
    }

    if (oldMetadata) {
      oldMetadata.moduleId = moduleId;
      oldMetadata.pageType = pageType;
      oldMetadata.name = name;
      await this.metadataModel.save(oldMetadata);
    } else {
      let metadata = this.metadataModel.create({
        ...body,
        type: 1,
        projectId: 35,
        status: 1
      });
      await this.metadataModel.save(metadata);
    }
  }

  /**
   *添加metadata
   *
   * @param {AddMetadataDto} body
   * @returns {Promise<void>}
   * @memberof MetadataService
   */
  public async addMetadata(body: AddMetadataDto): Promise<void> {
    const { code, projectId, tags, newTags } = body;
    const oldMetadata = await this.metadataModel.findOne({
      code: code
    });
    if (oldMetadata && !oldMetadata.isDeleted) {
      throw new HttpBadRequestError(`元数据${code}重复`);
    }

    // 获取已有的标签
    let metadataTags = [];
    if (tags && tags.length) {
      metadataTags = await this.metadataTagModel.findByIds(tags);
    }
    // 处理新增的标签
    if (newTags && newTags.length) {
      const newMetadataTagModels = [];
      for (let item of newTags) {
        const oldTag = await this.metadataTagModel.findOne({ name: item });
        if (oldTag) {
          metadataTags.push(oldTag);
          continue;
        }
        newMetadataTagModels.push(this.metadataTagModel.create({ name: item }));
      }
      const newMetadataTags = await this.metadataTagModel.save(newMetadataTagModels);
      metadataTags.push(...newMetadataTags);
    }

    if (oldMetadata) {
      if (oldMetadata.projectId !== projectId) {
        throw `${code} 已经在Id为${oldMetadata.projectId}的项目中添加了`;
      }
      oldMetadata.isDeleted = false;
      oldMetadata.name = body.name;
      oldMetadata.type = body.type;
      oldMetadata.pageType = body.pageType;
      oldMetadata.moduleId = body.moduleId;
      oldMetadata.status = body.status;
      oldMetadata.tags.push(...metadataTags);
      await this.metadataModel.save(oldMetadata);
      return;
    }

    let metadata = this.metadataModel.create({
      ...body,
      tags: []
    });

    metadata.tags.push(...metadataTags);
    await this.metadataModel.save(metadata);
    return;
  }

  private async getHttpBuffer(url: string): Promise<Buffer> {
    const request = require('request');
    const res = await request.get(url);
    const response = [];
    return new Promise((resolve, reject) => {
      res.on('data', function(chunk) {
        response.push(chunk);
      });

      res.on('end', function() {
        resolve(Buffer.concat(response));
      });
    });
  }

  public async test2(id?: number): Promise<any> {
    if (id) {
      const metadata = await this.metadataModel.findOne({ id });
      await this.metadataModel.remove(metadata);
      return;
    }

    const metadatas = await this.metadataModel.find();
    const datas = [];

    for (let item of metadatas) {
      const data = { code: '' };
      const metadata = await this.metadataModel.find({
        code: item.code
      });

      if (metadata.length > 1) {
        data.code = JSON.stringify(metadata);
      }
    }
    return datas;
  }

  public async test(url: string): Promise<any> {
    const res = await this.getHttpBuffer(url);
    const datas = await this.xlsxervice.parseByBuffer(
      res,
      ['埋点ID', '项目名称', 'trackid', '名称', '埋点类型', '状态', '模块名称', '页面类型', '备注'],
      ['id', 'projectName', 'code', 'name', 'name', 'type', 'status', 'moduleName', 'pageTypeName', 'description']
    );

    const metadatas = datas.filter(item => item.code);

    //处理模块

    const moduleNames = [...new Set(datas.filter(item => !!item.moduleName).map(item => item.moduleName))] as string[];
    const modules = moduleNames.length ? await this.moduleModel.find({ name: In(moduleNames) }) : [];

    // if (modules.length !== moduleNames.length) {
    //   throw new Error('模块不能未空');
    // }

    //处理页面类型
    const pageTypes = await this.httpService
      .get<{ label: string; value: string }[]>('https://static.91jkys.com/dms/defa6d786f0531ab6fedb525705b53de.json')
      .toPromise();
    let data = [['code', 'checkSls', 'checkPageType', 'checkModule', 'checkName', 'checkCode']];
    for (let key in metadatas) {
      const item = datas[key];
      try {
        const pageType = pageTypes.data.find(i => i.label == item.pageTypeName);
        const curModule = modules.find(val => val.name == item.moduleName);

        const oldMetadata = await this.metadataModel.findOne({
          code: item.code,
          isDeleted: false
        });

        if (!oldMetadata) {
          item.checkCode = '元数据未录入平台';
        } else if (oldMetadata) {
          item.checkCode = '元数据录入平台';
        }

        const slsdata = await this.slsService.query({
          query: `trackId:${item.code}`,
          from: Date.now() - 86400000 * 30,
          to: Date.now()
        });
        if (slsdata.length) {
          item.checkSls = '有数据';
        } else {
          item.checkSls = '无数据';
        }

        if (!item.pageTypeName) {
          item.checkPageType = '页面类型为空';
        } else if (!pageType) {
          item.checkPageType = '页面类型未录入平台';
        }

        if (!item.moduleName) {
          item.checkModule = '模块为空';
        } else if (!curModule) {
          item.checkModule = '模块未录入平台';
        }

        if (!/.*-(click|page|view)-.*/.test(item.code)) {
          item.checkName = '命名不规范';
        }
        data.push([item.code, item.checkSls, item.checkPageType, item.checkModule, item.checkName, item.checkCode]);
        console.log(key);
      } catch (error) {
        console.log(item.code);
        continue;
      }
    }

    return data;
  }

  public async addMetadataByExcel(projectId: number, url: string, manager: EntityManager): Promise<void> {
    const res = await this.getHttpBuffer(url);
    const datas = await this.xlsxervice.parseByBuffer(
      res,
      ['应用', '名称', 'code', '类型', '启用', '标签', '模块', '页面类型', '版本', '备注'],
      [
        'projectName',
        'name',
        'code',
        'type',
        'status',
        'newTags',
        'moduleName',
        'pageTypeName',
        'version',
        'description'
      ]
    );

    const metadatas = datas.filter(
      item =>
        item.name ||
        item.code ||
        item.type ||
        item.status ||
        item.newTags ||
        item.moduleName ||
        item.pageTypeName ||
        item.description ||
        item.projectName ||
        item.version
    );

    const tagNames = metadatas.reduce((total, item) => {
      const newTags = item.newTags ? item.newTags.split(',') : [];
      return total.concat(newTags);
    }, []) as string[];

    // 先处理新增的标签
    const allMetadataTags = [];
    const newMetadataTags = [];
    for (let tagName of [...new Set(tagNames)]) {
      const oldTag = await this.metadataTagModel.findOne({ name: tagName });
      if (oldTag) {
        allMetadataTags.push(oldTag);
        continue;
      }
      const newMetadataTag = this.metadataTagModel.create({ name: tagName });
      newMetadataTags.push(newMetadataTag);
      await manager.save(MetadataTagModel, newMetadataTag);
    }

    allMetadataTags.push(...newMetadataTags);

    //处理应用
    const projectNames = [
      ...new Set(datas.filter(item => !!item.projectName).map(item => item.projectName))
    ] as string[];
    const projects = projectNames.length ? await this.projectModel.find({ name: In(projectNames) }) : [];

    if (projectId && (!projects || projects.length > 1 || projects[0].id !== projectId)) {
      throw new Error('excel表中包含非本应用的元数据');
    }

    //处理模块

    const moduleNames = [...new Set(datas.filter(item => !!item.moduleName).map(item => item.moduleName))] as string[];
    const modules = moduleNames.length ? await this.moduleModel.find({ name: In(moduleNames) }) : [];

    // if (modules.length !== moduleNames.length) {
    //   throw new Error('模块不能未空');
    // }

    //处理页面类型
    const pageTypes = await this.httpService
      .get<{ label: string; value: string }[]>('https://static.91jkys.com/dms/defa6d786f0531ab6fedb525705b53de.json')
      .toPromise();

    for (let key in metadatas) {
      const item = datas[key];
      if (!item.name || !item.code || !item.type) {
        throw `第${key}行格式错误`;
      }

      const pageType = pageTypes.data.find(i => i.label == item.pageTypeName);

      const curModule = modules.find(val => val.name == item.moduleName);
      const project = projects.find(val => val.name == item.projectName);
      const newMetadata = {
        name: item.name,
        code: item.code,
        url: item.url,
        type: this.getActionType(item.type),
        status: item.status === '是' ? 1 : 0,
        moduleId: curModule ? curModule.id : 0,
        pageType: pageType ? pageType.value : 'undefined',
        description: item.description,
        projectId: project.id || projectId,
        version: item.version
      };

      const { code } = newMetadata;
      const oldMetadata = await this.metadataModel.findOne({
        code: code
      });

      if (oldMetadata && oldMetadata.projectId !== projectId) {
        throw `第${key}行 ${code} 已经在Id位${oldMetadata.projectId}的项目中添加了`;
      }

      // if (oldMetadata && oldMetadata.isDeleted === false && oldMetadata.name !== '') {
      //   throw new HttpBadRequestError(`第${key}行,元数据${code}重复`);
      // }

      let metadataTags = [];

      const newTags = item.newTags ? item.newTags.split(',') : [];
      if (newTags && newTags.length) {
        for (const tagName of newTags) {
          metadataTags.push(allMetadataTags.find(val => val.name === tagName));
        }
      }
      if (oldMetadata) {
        oldMetadata.isDeleted = false;
        oldMetadata.name = newMetadata.name;
        oldMetadata.type = newMetadata.type;
        oldMetadata.status = newMetadata.status;
        oldMetadata.description = newMetadata.description;
        oldMetadata.moduleId = newMetadata.moduleId;
        oldMetadata.pageType = newMetadata.pageType;
        oldMetadata.tags = oldMetadata.tags || [];
        oldMetadata.tags.push(...metadataTags);
        oldMetadata.version = newMetadata.version;
        await manager.save(MetadataModel, oldMetadata);

        continue;
      }
      const metadata =
        oldMetadata ||
        this.metadataModel.create({
          ...newMetadata,
          tags: []
        });

      metadata.tags.push(...metadataTags);
      await manager.save(MetadataModel, metadata);
    }

    return;
  }

  /**
   *修改metadata
   *
   * @param {UpdateMetadataDto} body
   * @returns {Promise<void>}
   * @memberof MetadataService
   */
  public async updateMetadata(body: UpdateMetadataDto): Promise<void> {
    let { id, tags, projectId } = body;
    let metadata = await this.metadataModel.findOne(id);

    // 处理新增的标签
    if (body.newTags && body.newTags.length) {
      // 获取已有的标签
      const metadataTags = await this.metadataTagModel.findByIds(tags);
      const newMetadataTagModels = [];
      body.newTags.forEach(item => {
        newMetadataTagModels.push(this.metadataTagModel.create({ name: item }));
      });
      const newMetadataTags = await this.metadataTagModel.save(newMetadataTagModels);
      metadataTags.push(...newMetadataTags);
      metadata.tags = [...metadataTags];
    }
    metadata = { ...metadata, ...body, tags: metadata.tags };

    await this.metadataModel.save(metadata);
    return;
  }

  /**
   * 离线技术日志数
   * @param body
   */
  public async updateMetadataLog(body: UpdateMetadataLogDto): Promise<void> {
    let { id } = body;
    let metadata = await this.metadataModel.findOne(id);

    if (!metadata) {
      return;
    }
    const opt = {
      query: `trackId : "${metadata.code}"  and projectId : ${metadata.projectId}|SELECT COUNT(*) as count`,
      from: new Date(metadata.createdAt).getTime() - 86400000 * 30,
      to: Date.now()
    };

    const all = await this.slsService.query<any>(opt);

    if (Number(all[0].count) === metadata.log) {
      return;
    }
    opt.from = Date.now() - 86400000 * 3;
    const recent = await this.slsService.query<any>(opt);

    const optApp = {
      query: `trackId : "${metadata.code}"  and projectId : ${metadata.projectId} and appId:*|SELECT COUNT(*) as count`,
      from: new Date(metadata.createdAt).getTime() - 86400000 * 30,
      to: Date.now()
    };

    const allApp = await this.slsService.query<any>(optApp);
    optApp.from = Date.now() - 86400000 * 3;
    const recentApp = await this.slsService.query<any>(optApp);

    const result = {
      all: Number(all[0].count),
      recent: Number(recent[0].count),
      allApp: Number(allApp[0].count),
      recentApp: Number(recentApp[0].count)
    };

    if (!metadata.url) {
      const url = await this.slsService.query<any>({
        ...opt,
        query: `trackId : ${metadata.code} and projectId : ${metadata.projectId}|SELECT url group by url`
      });
      metadata.url = url[0] ? url[0].url : '';
    }

    metadata.log = result.all;
    metadata.recentLog = result.recent;

    metadata.logByApp = result.allApp;
    metadata.recentLogByApp = result.recentApp;

    metadata.logByH5 = result.all - result.allApp;
    metadata.recentLogByH5 = result.recent - result.recentApp;

    await this.metadataModel.save(metadata);
    return;
  }

  /**
   *修改metadata
   *
   * @param {UpdateMetadataDto} body
   * @returns {Promise<void>}
   * @memberof MetadataService
   */
  public async updateMetadataBatch(body: UpdateMetadataBatchDto, manager: EntityManager): Promise<void> {
    let { ids, tags, projectId, status, type, version, moduleId, pageType } = body;
    const metadatas = await this.metadataModel.find({ where: { id: In(ids) }, relations: ['tags'] });
    switch (type) {
      case 'DEL':
        for (const metadata of metadatas) {
          if (metadata.log || metadata.status) {
            metadata.isDeleted = true;
            await manager.save(MetadataModel, metadata);
          } else {
            await manager.remove(MetadataModel, metadata);
          }
        }

        break;

      case 'VERSION':
        for (const metadata of metadatas) {
          metadata.version = version;
          await manager.save(MetadataModel, metadata);
        }

        break;

      case 'MODULE':
        for (const metadata of metadatas) {
          metadata.moduleId = moduleId;
          await manager.save(MetadataModel, metadata);
        }

        break;

      case 'PAGE_TYPE':
        for (const metadata of metadatas) {
          metadata.pageType = pageType;
          await manager.save(MetadataModel, metadata);
        }

        break;

      case 'SELF_CHECKOUT':
        for (const metadata of metadatas) {
          metadata.selfCheckoutStatus = 2;
          await manager.save(MetadataModel, metadata);
        }

        break;
      case 'FAIL_SELF_CHECKOUT':
        for (const metadata of metadatas) {
          metadata.selfCheckoutStatus = 0;
          await manager.save(MetadataModel, metadata);
        }

        break;

      case 'CHECKOUT':
        for (const metadata of metadatas) {
          metadata.checkoutStatus = 2;
          await manager.save(MetadataModel, metadata);
        }

        break;
      case 'FAIL_CHECKOUT':
        for (const metadata of metadatas) {
          metadata.checkoutStatus = 0;
          await manager.save(MetadataModel, metadata);
        }

        break;

      case 'SELF_CHECKOUT':
        for (const metadata of metadatas) {
          metadata.selfCheckoutStatus = 2;
          await manager.save(MetadataModel, metadata);
        }

        break;
      case 'FAIL_SELF_CHECKOUT':
        for (const metadata of metadatas) {
          metadata.selfCheckoutStatus = 0;
          await manager.save(MetadataModel, metadata);
        }

        break;

      case 'TAG': {
        // 先处理新增的标签
        const newMetadataTags = [];
        for (let tagName of tags) {
          const tag = await this.metadataTagModel.findOne({ name: tagName });
          if (tag) {
            newMetadataTags.push(tag);
            continue;
          }
          const newMetadataTag = this.metadataTagModel.create({ name: tagName });
          newMetadataTags.push(newMetadataTag);
          await manager.save(MetadataTagModel, newMetadataTag);
        }

        for (const metadata of metadatas) {
          metadata.tags = metadata.tags || [];
          metadata.tags.push(...newMetadataTags);
          await manager.save(MetadataModel, metadata);
        }
        break;
      }

      default:
        {
          for (const metadata of metadatas) {
            metadata.status = status;
            await manager.save(MetadataModel, metadata);
          }
        }
        break;
    }
  }

  /**
   *删除metadata  如果有日志则不能真删除
   *
   * @param {number} id
   * @returns {Promise<void>}
   * @memberof MetadataService
   */
  public async deleteMetadata(id: number): Promise<void> {
    const metadata = await this.metadataModel.findOne(id);
    if (metadata.log || metadata.status) {
      metadata.isDeleted = true;
      await this.metadataModel.save(metadata);
    } else {
      await this.metadataModel.remove(metadata);
    }
    return;
  }

  public async enableMetadata(id: number): Promise<void> {
    let metadata = await this.metadataModel.findOne(id);
    metadata = { ...metadata, status: 1 };
    await this.metadataModel.save(metadata);
    return;
  }

  public async disableMetadata(id: number): Promise<void> {
    let metadata = await this.metadataModel.findOne(id);
    metadata = { ...metadata, status: 0 };
    await this.metadataModel.save(metadata);
    return;
  }

  public async getMetadatasByCodes(codes: string[]): Promise<MetadataModel[]> {
    return await this.metadataModel.find({
      code: In(codes)
    });
  }

  /**
   * 标签相关接口
   */

  public async getMetadataTags(query: QueryListQuery<QueryMetadataTagListDto>): Promise<PageData<MetadataTagModel>> {
    const searchBody: FindManyOptions<MetadataTagModel> = {
      skip: query.skip,
      take: query.take,
      order: {}
    };

    const [metadataTag, totalCount] = await this.metadataTagModel.findAndCount(searchBody);
    return {
      totalCount,
      list: metadataTag
    };
  }

  public async addMetadataTag(body: AddMetadataTagDto): Promise<void> {
    const oldMetadata = await this.metadataTagModel.findOne({
      name: body.name
    });
    if (oldMetadata) {
      throw new HttpBadRequestError('标签已经存在');
    }
    const metadata = this.metadataTagModel.create({
      ...body
    });
    await this.metadataTagModel.save(metadata);
    return;
  }

  public async updateMetadataTag(body: UpdateMetadataTagDto): Promise<void> {
    let metadataTag = await this.metadataTagModel.findOne(body.id);
    metadataTag = { ...metadataTag, ...body };
    await this.metadataTagModel.save(metadataTag);
    return;
  }

  public async deleteMetadataTag(id: number): Promise<void> {
    const metadataTag = await this.metadataTagModel.findOne(id);
    await this.metadataTagModel.remove(metadataTag);
    return;
  }

  /**
   * 定时查找未定义的元数据
   */
  public async scheduleIntervalFindMetadata(): Promise<void> {
    const client = await this.redisService.getClient();
    const projectIndex = Number(await client.get('projectCheckedIndex')) || 0;
    let projectIds = JSON.parse((await client.get('projectIds')) || '[]');

    if (!projectIds.length || projectIds.length < projectIndex + 1) {
      projectIds = (await this.projectModel.find({
        where: {
          status: 1,
          isDeleted: false
        }
      })).map(item => item.id);
      client.set('projectCheckedIndex', 0, 'PX', 60 * 24 * 3);
      client.set('projectIds', JSON.stringify(projectIds), 'PX', 60 * 24 * 3);
      return;
    }

    const projectId: number = projectIds[projectIndex];
    client.set('projectCheckedIndex', projectIndex + 1, 'PX', 60 * 24 * 3);

    const metadatas = await this.metadataModel.find({ projectId });

    const opt = {
      query: `trackId:* and projectId:${projectId}|SELECT trackId group by trackId`,
      from: new Date().setHours(0, 0, 0, 0) - 8640000 * 1,
      to: Date.now()
    };

    const result = await this.slsService.query<{ trackId: string }>(opt);

    if (result && result.length) {
      result
        .filter(item => !metadatas.find(val => val.code === item.trackId))
        .forEach(async item => {
          await this.addMetadata({
            code: item.trackId,
            projectId,
            name: '',
            newTags: ['未定义'],
            type: /page/.test(item.trackId) ? 1 : 2,
            status: 0,
            moduleId: null,
            pageType: null
          });
        });
    }
  }

  public async scheduleIntervalCheckMetadata(): Promise<void> {
    try {
      const client = await this.redisService.getClient();
      const metadataIndex = Number(await client.get('metadataCheckedIndex')) || 0;
      let metadataIds = JSON.parse((await client.get('metadataIds')) || '[]');

      if (!metadataIds.length || metadataIds.length < metadataIndex + 1) {
        metadataIds = (await this.metadataModel.find({
          where: {
            status: 1,
            isDeleted: false
          }
        })).map(item => item.id);
        client.set('metadataCheckedIndex', 0, 'PX', 60 * 24 * 3);
        client.set('metadataIds', JSON.stringify(metadataIds), 'PX', 60 * 24 * 3);
        return;
      }

      const metadataId = metadataIds[metadataIndex];
      client.set('metadataCheckedIndex', metadataIndex + 1, 'PX', 60 * 24 * 3);

      await this.updateMetadataLog({
        id: metadataId
      });
    } catch (error) {
      console.log('离线计算错误', error);
    }
  }

  public async scheduleCronComputedAllEventAttrRecommend(): Promise<void> {
    const client = await this.redisService.getClient();
    const eventAttrs = JSON.parse(JSON.stringify(EVENT_ATTRS));

    for (let attr of eventAttrs) {
      if (!attr.autoRecommend) {
        continue;
      }
      try {
        const opt = {
          // tslint:disable-next-line: max-line-length
          query: `* | select ${attr.value} , pv from( select count(1) as pv , ${attr.value} from (select ${attr.value} from log limit 100000) group by ${attr.value} order by pv desc) order by pv desc limit 10`,
          from: Date.now() - 86400 * 30,
          to: Date.now()
        };
        const result = await this.slsService.query(opt);
        attr.recommend.unshift(...result.map(item => ({ value: item[attr.value], text: item[attr.value] })));
        console.log(attr.recommend);
      } catch (error) {}
    }

    client.set(`eventAttrsRecommend`, JSON.stringify(eventAttrs), 'PX', 60 * 24 * 3);
  }

  public async scheduleCronComputedEventAttrRecommend(): Promise<void> {
    const client = await this.redisService.getClient();
    const metadataIndex = Number(await client.get('metadataComputeAttrIndex')) || 0;

    let metadataIds = JSON.parse((await client.get('metadataComputeAttrIds')) || '[]');
    const eventAttrs = JSON.parse(JSON.stringify(EVENT_ATTRS));

    // 计算所有 todo 直接copy
    if (!metadataIds.length || metadataIds.length < metadataIndex + 1) {
      metadataIds = (await this.metadataModel.find({
        where: {
          status: 1,
          isDeleted: false,
          recentLog: MoreThan(1000)
        }
      })).map(item => item.id);
      client.set('metadataComputeAttrIndex', 0, 'PX', 60 * 24 * 3);
      client.set('metadataComputeAttrIds', JSON.stringify(metadataIds), 'PX', 60 * 24 * 3);

      return;
    }

    const metadataId = metadataIds[metadataIndex];
    client.set('metadataComputeAttrIndex', metadataIndex + 1, 'PX', 60 * 24 * 3);

    const metadata = await this.metadataModel.findOne(metadataId);
    if (!metadata) {
      return;
    }

    for (let attr of eventAttrs) {
      if ((attr.eventType && metadata.type !== attr.eventType) || !attr.autoRecommend) {
        continue;
      }
      try {
        const opt = {
          // tslint:disable-next-line: max-line-length
          query: `trackId : ${metadata.code} and projectId :${metadata.projectId} | select ${attr.value} , pv from( select count(1) as pv , ${attr.value} from (select ${attr.value} from log limit 100000) group by ${attr.value} order by pv desc) order by pv desc limit 10`,
          from: Date.now() - 86400 * 30,
          to: Date.now()
        };
        const result = await this.slsService.query(opt);

        attr.recommend.unshift(...result.map(item => ({ value: item[attr.value], text: item[attr.value] })));
      } catch (e) {
        console.error('推荐离线查询错误');
      }
    }
    client.set(
      `eventAttrsRecommend${metadata.projectId}_${metadata.code}`,
      JSON.stringify(eventAttrs),
      'PX',
      60 * 24 * 3
    );
  }

  public async getFieldList(query: GetEventAttrDto): Promise<ListData<EventAttrsListDto>> {
    const client = await this.redisService.getClient();
    let key = 'eventAttrsRecommend';
    if (query.metadataCode !== '_ALL_METADATA') {
      key = `eventAttrsRecommend_${query.projectId}_${query.metadataCode}`;
    }
    let eventAttrsStr = (await client.get(key)) || (await client.get('eventAttrsRecommend'));
    const eventAttrs: EventAttrsListDto[] = eventAttrsStr ? JSON.parse(eventAttrsStr) : EVENT_ATTRS;
    return { list: eventAttrs };
  }
}

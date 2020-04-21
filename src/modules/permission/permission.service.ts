import { PermissionModel } from '@/modules/permission/permission.model';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import {
  AddPermissionDto,
  BasePermissionDto,
  PermissionItemDto,
  PermissionListItemDto,
  QueryPermissionDto,
  UpdatePermissionDto
} from '@/modules/permission/permission.dto';
import { HttpBadRequestError } from '@/errors/bad-request.error';
import { PageData, QueryListQuery } from '@/interfaces/request.interface';
import { UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { RolePermissionModel } from '@/modules/auth/auth.model';
import { RoleService } from '@/modules/role/role.service';
import { RedisService } from 'nestjs-redis';
import { REDIS_EX_LONG_TIME, REDIS_KEY_ALL_PERMISSIONS } from '@/constants/common.constant';
import Utils from '@/utils/utils';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionModel)
    private readonly permissionModel: Repository<PermissionModel>,
    @InjectRepository(RolePermissionModel)
    private readonly rolePermissionModel: Repository<RolePermissionModel>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    private readonly redisService: RedisService,
  ) {}

  private async deleteRedisAllPermissionsCache(): Promise<void> {
    const client = await this.redisService.getClient();
    await client.del(REDIS_KEY_ALL_PERMISSIONS);
  }

  /**
   * 添加权限
   * @param currentUser: 当前登录用户
   * @param body: 权限对象
   * @return Promise<PermissionListItemDto>
   */
  public async addPermission(currentUser: UserModel, body: BasePermissionDto): Promise<PermissionListItemDto> {
    await this.userService.checkGlobalAdmin(currentUser, true);
    // 格式优化
    body.name = Utils.trimAll(body.name);
    body.code = Utils.trimAll(body.code.toLocaleUpperCase());
    const permission = await this.permissionModel.findOne({
      where: [
        { name: body.name },
        { code: body.code }
      ]
    });

    if (permission && permission.name === body.name) throw new HttpBadRequestError('权限名已存在');
    if (permission && permission.code === body.code) throw new HttpBadRequestError('Code已存在');

    const addPermission: AddPermissionDto = {
      ...body,
      creatorId: currentUser.id,
      updaterId: currentUser.id,
    };

    const saveRes = await this.permissionModel.save(addPermission);
    // 新加的权限都主动关联到超管角色下
    const roleGlobalAdminId = await this.roleService.getRoleGlobalAdminId();
    await this.rolePermissionModel.save({
      roleId: roleGlobalAdminId,
      permissionId: saveRes.id,
    });
    // 删除Redis所有权限的缓存
    await this.deleteRedisAllPermissionsCache();

    return {
      ...saveRes,
      updaterId: currentUser.id,
      updaterNickname: currentUser.nickname,
    };
  }

  /**
   * 获取权限列表
   * @param currentUser: 当前登录用户
   * @param query: 查询对象
   * @return Promise<PageData<PermissionListItemDto>>
   */
  public async getPermissions(currentUser: UserModel, query: QueryListQuery<QueryPermissionDto>): Promise<PageData<PermissionListItemDto>> {
    await this.userService.checkGlobalAdmin(currentUser, true);
    const [permissions, totalCount] = await this.permissionModel.findAndCount({
      select: ['id', 'name', 'description', 'code', 'status', 'type', 'updaterId', 'updatedAt'],
      skip: query.skip,
      take: query.take,
      where: { name: Like(`%${query.query.name || ''}%`), isDeleted: 0 }
    });

    if (!permissions.length) return {
      totalCount: 0,
      list: []
    };

    const userIds = permissions.map(permissions => permissions.updaterId);
    const users = await this.userService.getUsersBaseInfoByIds(userIds);
    const list = permissions.map(permission => ({
      ...permission,
      updaterNickname: users.find(user => permission.updaterId === user.id).nickname
    }));

    return {
      totalCount,
      list,
    };
  }

  /**
   * 删除权限
   * @param currentUser: 当前登录用户
   * @param id: 权限ID
   * @return Promise<void>
   */
  public async deletePermission(currentUser: UserModel, id: number): Promise<void> {
    await this.userService.checkGlobalAdmin(currentUser, true);
    await this.permissionModel.update({ id }, { updaterId: currentUser.id, isDeleted: 1 });
    // 删除Redis所有权限的缓存
    await this.deleteRedisAllPermissionsCache();

  }

  /**
   * 更新权限信息
   * @param currentUser: 当前登录用户
   * @param body: 更新权限对象
   * @return Promise<void>
   */
  public async updatePermission(currentUser: UserModel, body: UpdatePermissionDto): Promise<void> {
    await this.userService.checkGlobalAdmin(currentUser, true);
    // 只开启描述与状态更新
    const updatePermission = {
      description: body.description,
      status: body.status
    };
    await this.permissionModel.update({ id: body.id }, {
      ...updatePermission,
      updaterId: currentUser.id
    });
    // 删除Redis所有权限的缓存
    await this.deleteRedisAllPermissionsCache();
  }

  /**
   * 通过权限ID批量获取权限信息
   * @param ids: 权限ID列表
   * @return Promise<PermissionItemDto[]>
   */
  public async getPermissionsByIds(ids: number[]): Promise<PermissionItemDto[]> {
    return await this.permissionModel.find({
      select: ['id', 'name', 'description', 'code', 'status', 'type', 'updaterId', 'updatedAt'],
      where: {
        id: In(ids),
        isDeleted: 0
      }
    })
  }

  /**
   * 通过角色ID获取权限列表
   * @param id: 角色ID
   * @return Promise<PermissionItemDto[]>
   */
  public async getPermissionIdsByRoleId(id: number): Promise<PermissionItemDto[]> {
    const rolePermissions = await this.rolePermissionModel.find({
      where: {
        roleId: id,
        isDeleted: 0
      }
    });
    if (!rolePermissions.length) return [];
    const permissionIds = rolePermissions.map(rolePermission => rolePermission.permissionId);
    return await this.getPermissionsByIds(permissionIds);
  }

  /**
   * 获取所有权限列表
   * @return Promise<PermissionItemDto[]>
   */
  public async getAllPermissions(): Promise<PermissionItemDto[]> {
    const client = await this.redisService.getClient();
    const permissionsStr = await client.get(REDIS_KEY_ALL_PERMISSIONS);
    if (!permissionsStr) {
      const permissions = await this.permissionModel.find({ where: { isDeleted: 0 } });
      await client.set(REDIS_KEY_ALL_PERMISSIONS, JSON.stringify(permissions), 'EX', REDIS_EX_LONG_TIME);
      return permissions;
    }
    return JSON.parse(permissionsStr);
  }
}
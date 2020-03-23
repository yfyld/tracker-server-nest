import { RoleModel } from '@/modules/role/role.model';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, getManager, EntityManager } from 'typeorm';
import {
  AddRoleDto,
  BaseRoleDto,
  RoleItemDto,
  QueryRoleDto,
  UpdateRoleDto,
  RoleListItemDto,
  RolePermission
} from '@/modules/role/role.dto';
import { HttpBadRequestError } from '@/errors/bad-request.error';
import { PageData, QueryListQuery } from '@/interfaces/request.interface';

import { UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { RolePermissionModel, UserRoleModel } from '@/modules/auth/auth.model';
import {
  REDIS_EX_LONG_TIME,
  REDIS_KEY_ALL_PERMISSIONS,
  REDIS_KEY_ROLE_GLOBAL_ADMIN_ID,
  ROLE_CODE_GLOBAL_ADMIN,
  REDIS_KEY_ALL_ROLES, GLOBAL_ADMIN_USERNAME
} from '@/constants/common.constant';
import { RedisService } from 'nestjs-redis';
import { PermissionService } from '../permission/permission.service';
import { PermissionItemDto } from '@/modules/permission/permission.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleModel)
    private readonly roleModel: Repository<RoleModel>,
    @InjectRepository(RolePermissionModel)
    private readonly rolePermissionModel: Repository<RolePermissionModel>,
    @InjectRepository(UserRoleModel)
    private readonly userRoleModel: Repository<UserRoleModel>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => PermissionService))
    private readonly permissionService: PermissionService,
    private readonly redisService: RedisService,
  ) {}

  private async deleteRedisAllRolesCache(): Promise<void> {
    const client = await this.redisService.getClient();
    await client.del(REDIS_KEY_ALL_ROLES);
  }

  /**
   * 添加角色
   * @param user: 当前登录用户
   * @param body: 新增角色对象
   * @return Promise<RoleListItemDto>
   */
  public async addRole(user: UserModel, body: BaseRoleDto): Promise<RoleListItemDto> {
    await this.userService.checkGlobalAdmin(user, true);
    const role = await this.roleModel.findOne({
      where: [
        { name: body.name },
        { code: body.code }
      ]
    });

    if (role && role.name === body.name) throw new HttpBadRequestError('角色名已存在');
    if (role && role.code === body.code) throw new HttpBadRequestError('Code已存在');

    const addRole: AddRoleDto = {
      ...body,
      creatorId: user.id,
      updaterId: user.id,
    };

    const saveRes = await this.roleModel.save(addRole);

    // 删除Redis所有角色缓存
    await this.deleteRedisAllRolesCache();

    return {
      ...saveRes,
      updaterId: user.id,
      updaterNickname: user.nickname,
    };
  }

  /**
   * 获取角色列表
   * @param query: 角色列表查询对象
   * @return Promise<PageData<RoleListItemDto>>
   */
  public async getRoles(query: QueryListQuery<QueryRoleDto>): Promise<PageData<RoleListItemDto>> {
    const [roles, totalCount] = await this.roleModel.findAndCount({
      select: ['id', 'name', 'description', 'code', 'status', 'type', 'updaterId', 'updatedAt'],
      skip: query.skip,
      take: query.take,
      where: [
        {
          name: Like(`%${query.query.name || ''}%`),
          isDeleted: 0
        },
        {
          code: Like(`%${query.query.code || ''}%`),
          isDeleted: 0
        },
      ]
    });
    if (!roles.length) return {
      totalCount: 0,
      list: []
    };

    const userIds = roles.map(roles => roles.updaterId);
    const users = await this.userService.getUsersBaseInfoByIds(userIds);
    const list = roles.map(role => ({
      ...role,
      updaterNickname: users.find(user => role.updaterId === user.id).nickname
    }));

    return {
      totalCount,
      list,
    };
  }

  /**
   * 删除角色
   * @param user: 当前登录用户
   * @param id: 角色ID
   * @return Promise<void>
   */
  public async deleteRole(user: UserModel, id: number): Promise<void> {
    await this.userService.checkGlobalAdmin(user, true);
    await this.roleModel.update({ id }, { isDeleted: 1 });
    // 删除Redis所有角色缓存
    await this.deleteRedisAllRolesCache();
  }

  /**
   * 更新角色
   * @param user: 当前登录用户
   * @param body: 更新角色对象
   * @return Promise<void>
   */
  public async updateRole(user: UserModel, body: UpdateRoleDto): Promise<void> {
    await this.userService.checkGlobalAdmin(user, true);
    await this.roleModel.update({ id: body.id }, {
      ...body,
      updaterId: user.id
    });
    // 删除Redis所有角色缓存
    await this.deleteRedisAllRolesCache();
  }

  /**
   * 根据角色ID批量获取角色信息
   * @param ids: 角色ID数组
   * @return Promise<RoleItemDto[]>: 角色列表基本信息
   */
  public async getRolesByIds(ids: number[]): Promise<RoleItemDto[]> {
    return await this.roleModel.find({
      select: ['id', 'name', 'description', 'code', 'status', 'type', 'updaterId', 'updatedAt'],
      where: {
        id: In(ids),
        isDeleted: 0
      }
    });
  }

  /**
   * 获取超管角色ID
   * @return Promise<number>
   */
  public async getRoleGlobalAdminId(): Promise<number> {
    const client = await this.redisService.getClient();
    let roleGlobalAdminId = parseInt(await client.get(REDIS_KEY_ROLE_GLOBAL_ADMIN_ID));
    if (!roleGlobalAdminId) {
      const roleGlobalAdmin = await this.roleModel.findOne({
        where: {
          code: ROLE_CODE_GLOBAL_ADMIN,
          isDeleted: 0,
        }
      });
      roleGlobalAdminId = roleGlobalAdmin && roleGlobalAdmin.id;
      roleGlobalAdmin && await client.set(REDIS_KEY_ROLE_GLOBAL_ADMIN_ID, roleGlobalAdmin.id, 'EX', REDIS_EX_LONG_TIME);
    }
    if (!roleGlobalAdminId) {
      const globalAdminUser = await this.userService.getUserByUsername(GLOBAL_ADMIN_USERNAME);
      roleGlobalAdminId = globalAdminUser.id;
      await client.set(REDIS_KEY_ROLE_GLOBAL_ADMIN_ID, roleGlobalAdminId, 'EX', REDIS_EX_LONG_TIME);
    }
    return roleGlobalAdminId;
  }

  /**
   * 获取所有角色列表
   * @return Promise<RoleItemDto[]>
   */
  public async getAllRoles(): Promise<RoleItemDto[]> {
    const client = await this.redisService.getClient();
    const rolesStr = await client.get(REDIS_KEY_ALL_ROLES);
    if (!rolesStr) {
      const roles = await this.roleModel.find({ where: { isDeleted: 0 } });
      await client.set(REDIS_KEY_ALL_ROLES, JSON.stringify(roles), 'EX', REDIS_EX_LONG_TIME);
      return roles;
    }
    return JSON.parse(rolesStr);
  }

  /**
   * 根据角色ID获取所有权限列表，并标记不可修改及已开启权限
   * @param id: 角色ID
   * @return Promise<RolePermission[]>: 权限信息包含能否修改及是否已开启
   */
  public async getRolePermissions(id: number): Promise<RolePermission[]> {
    const allPermissions = await this.permissionService.getAllPermissions();
    const rolePermissions = await this.permissionService.getPermissionIdsByRoleId(id);
    // 获取超管角色ID
    const roleGlobalAdminId = await this.getRoleGlobalAdminId();
    const checkedPermissionsIds = rolePermissions.map(rolePermission => rolePermission.id);
    return allPermissions.map(permission => {
      const p: RolePermission = {
        id: permission.id,
        name: permission.name,
        description: permission.description,
        code: permission.code,
        status: permission.status,
        type: permission.type,
        checked: false,
        disabled: false,
      };
      if (checkedPermissionsIds.includes(permission.id)) {
        p.checked = true;
      }
      if (roleGlobalAdminId === id) {
        p.disabled = true;
      }
      return p;
    });
  }

  /**
   * 更新角色下权限
   * @param currentUser: 当前登录用户
   * @param roleId: 角色ID
   * @param permissionIds: 权限ID列表
   * @return Promise<void>
   */
  public async updateRolePermissions(currentUser: UserModel, roleId: number, permissionIds: number[]): Promise<void> {
    await this.userService.checkGlobalAdmin(currentUser, true);
    await getManager().transaction(async (entityManage: EntityManager) => {
      // 删除角色下所有原有权限
      await entityManage.update(RolePermissionModel, { roleId }, { isDeleted: 1 });
      const saveDoc = permissionIds.map(permissionId => ({
        roleId,
        permissionId
      }));
      // 批量添加角色信息
      await entityManage.getRepository(RolePermissionModel).save(saveDoc, { chunk: 1000 });
    });
  }

  /**
   * 根据用户ID获取角色列表
   * @param id: 用户ID
   * @return Promise<RoleItemDto[]>
   */
  public async getRolesByUserId(id: number): Promise<RoleItemDto[]> {
    const userRoles = await this.userRoleModel.find({
      where: {
        userId: id,
        isDeleted: 0
      }
    });
    if (!userRoles.length) return [];
    const roleIds = userRoles.map(userRole => userRole.roleId);
    return await this.getRolesByIds(roleIds);
  }
}

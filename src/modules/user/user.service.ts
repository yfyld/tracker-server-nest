import { RoleModel } from './../role/role.model';
import { DEFAULT_ROLE_CODE } from './../../constants/permission.contant';
import { UserModel } from './user.model';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Repository, Like, In, getManager, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserListReqDto,
  UpdateUserDto,
  BaseUserDto,
  UserRoles,
  UserListItemDto,
  UpdateUserByAdminDto
} from './user.dto';
import { PageData, QueryListQuery } from '@/interfaces/request.interface';
import { ROLE_CODE_GLOBAL_ADMIN, GLOBAL_ADMIN_USERNAME } from '@/constants/common.constant';
import { HttpUnauthorizedError } from '@/errors/unauthorized.error';
import { AuthService } from '../auth/auth.service';
import { RoleService } from '../role/role.service';
import { HttpBadRequestError } from '@/errors/bad-request.error';

import { SignUpDto } from '../auth/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userModel: Repository<UserModel>,
    @InjectRepository(RoleModel)
    private readonly roleModel: Repository<RoleModel>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService
  ) {}

  /**
   * Token验证(已取消)
   * @param payload
   */
  public async validateAuthData(payload: any): Promise<any> {
    const user = await this.userModel.findOne({
      select: ['password'],
      where: {
        username: payload.username
      }
    });
    const isVerified = user && payload.password === user.password; // lodash.isEqual(payload.data, {username:user.username});
    return isVerified ? payload.data : null;
  }

  /**
   * 超管权限验证
   * @param user: 需要验证的用户
   * @param enableThrow: true权限不足，抛出异常
   */
  public async checkGlobalAdmin(user: UserModel, enableThrow = false): Promise<void | boolean> {
    // if (user.username === GLOBAL_ADMIN_USERNAME) return true;
    // const roles = await this.authService.getRolesByUserId(user.id);
    // const roleCodes = roles.map(item => item.code);
    // if (!roleCodes.includes(ROLE_CODE_GLOBAL_ADMIN)) {
    //   if (enableThrow) throw new HttpUnauthorizedError('权限不足');
    //   return false;
    // }
    return true;
  }

  /**
   * 根据用户名+密码添加（注册）用户
   * @param user: 用户名+密码传输对象
   * @return Promise<BaseUserDto>
   */
  public async addUser(user: SignUpDto): Promise<BaseUserDto> {
    const hasuser = await this.userModel.findOne({
      where: {
        username: user.username
      }
    });
    if (hasuser) {
      throw '您已注册过';
    }
    user.password = AuthService.encryptPassword(user.password);
    // 普通注册用户
    const role = await this.roleModel.findOne({
      code: DEFAULT_ROLE_CODE.USER
    });

    return await this.userModel.save({ ...user, roles: [role] });
  }

  /**
   * 通过用户ID删除用户
   * @param currentUser: 当前登录用户
   * @param id: 需要删除的用户ID
   * @return boolean: true/false,成功/失败
   */
  public async deleteUserById(currentUser: UserModel, id: number): Promise<void> {
    if (currentUser.id === id) throw new HttpBadRequestError('不能删除自己');
    await this.checkGlobalAdmin(currentUser, true);
    await this.userModel.update(
      { id },
      {
        isDeleted: 1
      }
    );
  }

  /**
   * 更新用户信息
   * @param currentUser: 当前登录用户
   * @param body: 需要修改的信息
   */
  public async updateUser(body: UpdateUserDto): Promise<void> {
    // todo
    // if (currentUser.id !== body.id) await this.checkGlobalAdmin(currentUser, true);
    await this.userModel.update({ id: body.id }, body);
  }

  /**
   * 更新用户信息
   * @param currentUser: 当前登录用户
   * @param body: 需要修改的信息
   */
  public async updateUserByAdmin(body: UpdateUserByAdminDto): Promise<void> {
    // todo
    // if (currentUser.id !== body.id) await this.checkGlobalAdmin(currentUser, true);
    const { mobile, roleIds, nickname, email, password } = body;
    const roles = roleIds.map(id => ({ id }));
    const user = await this.userModel.findOne(body.id);
    user.roles = roles as any;
    await this.userModel.save({ ...user, mobile, roles, nickname, email, password });
  }

  /**
   * 根据用户ID获取用户基本信息
   * @param id: 用户ID
   * @return Promise<BaseUserDto>
   */
  public async getUserBaseInfoById(id: number): Promise<BaseUserDto> {
    return await this.userModel.findOne({
      select: ['id', 'username', 'nickname', 'email', 'mobile'],
      where: {
        id,
        isDeleted: 0
      }
    });
  }

  /**
   * 根据用户ID数组批量获取用户信息
   * @param ids: 用户ID数组
   * @return Promise<BaseUserDto[]>
   */
  public async getUsersBaseInfoByIds(ids: number[]): Promise<BaseUserDto[]> {
    return await this.userModel.find({
      select: ['id', 'username', 'nickname', 'email', 'mobile'],
      where: {
        id: In(ids),
        isDeleted: 0
      },
      order: { updatedAt: 'DESC' }
    });
  }

  /**
   * 根据用户ID数组批量获取用户信息（Map存储）
   * @param ids: 用户ID列表
   * @return Promise<Map<number, BaseUserDto>>
   */
  public async getUsersBaseInfoMapByIds(ids: number[]): Promise<Map<number, BaseUserDto>> {
    const users = await this.getUsersBaseInfoByIds(ids);
    const userMap = new Map();
    users.forEach(user => userMap.set(user.id, user));
    return userMap;
  }

  /**
   * 根据用户名获取用户信息
   * @param username: 用户名
   * @return Promise<UserModel>
   */
  public async getUserByUsername(username: string): Promise<UserModel> {
    return await this.userModel.findOne({
      where: {
        username: username,
        isDeleted: 0
      }
    });
  }

  /**
   * 获取用户列表（只有超管可以查看）
   * @param currentUser: 当前登录用户
   * @param query: 查询对象
   * Promise<PageData<UserListItemDto>>
   */
  public async getUsers(
    currentUser: UserModel,
    query: QueryListQuery<UserListReqDto>
  ): Promise<PageData<UserListItemDto>> {
    const [users, totalCount] = await this.userModel.findAndCount({
      relations: ['roles'],
      where: [
        {
          username: Like(`%${query.query.username || ''}%`),
          isDeleted: 0
        },
        {
          nickname: Like(`%${query.query.username || ''}%`),
          isDeleted: 0
        }
      ],
      skip: query.skip,
      take: query.take
    });

    return {
      totalCount,
      list: users
    };
  }

  // /**
  //  * 更新角色下权限
  //  * @param currentUser: 当前登录用户
  //  * @param userId: 用户ID
  //  * @param roleIds: 角色ID列表
  //  * @return Promise<void>
  //  */
  // public async updateUserRoles(currentUser: UserModel, userId: number, roleIds: number[]): Promise<void> {
  //   await getManager().transaction(async (entityManage: EntityManager) => {
  //     // 删除用户下所有原有角色
  //     await entityManage.update(UserRoleModel, { userId }, { isDeleted: 1 });
  //     const saveDoc = roleIds.map(roleId => ({
  //       userId,
  //       roleId
  //     }));
  //     // 批量添加角色信息
  //     await entityManage.getRepository(UserRoleModel).save(saveDoc, { chunk: 1000 });
  //   });
  // }
}

import { UserModel } from './user.model';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Repository, Like, In, getManager, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserListReqDto, UpdateUserDto, BaseUserDto, UserRoles, UserListItemDto } from './user.dto';
import { PageData, QueryListQuery } from '@/interfaces/request.interface';
import { ROLE_CODE_GLOBAL_ADMIN, GLOBAL_ADMIN_USERNAME } from '@/constants/common.constant';
import { HttpUnauthorizedError } from '@/errors/unauthorized.error';
import { AuthService } from '../auth/auth.service';
import { RoleService } from '../role/role.service';
import { HttpBadRequestError } from '@/errors/bad-request.error';
import { UserRoleModel } from '../auth/auth.model';
import { SignUpDto } from '../auth/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userModel: Repository<UserModel>,
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
    if (user.username === GLOBAL_ADMIN_USERNAME) return true;
    const roles = await this.authService.getRolesByUserId(user.id);
    const roleCodes = roles.map(item => item.code);
    if (!roleCodes.includes(ROLE_CODE_GLOBAL_ADMIN)) {
      if (enableThrow) throw new HttpUnauthorizedError('权限不足');
      return false;
    }
    return true;
  }

  /**
   * 根据用户名+密码添加（注册）用户
   * @param user: 用户名+密码传输对象
   * @return Promise<BaseUserDto>
   */
  public async addUser(user: SignUpDto): Promise<BaseUserDto> {
    user.password = AuthService.encryptPassword(user.password);
    return await this.userModel.save(user);
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
        isDeleted: 1,
        updaterId: currentUser.id
      }
    );
  }

  /**
   * 更新用户信息
   * @param currentUser: 当前登录用户
   * @param body: 需要修改的信息
   */
  public async updateUser(currentUser: UserModel, body: UpdateUserDto): Promise<void> {
    if (currentUser.id !== body.id) await this.checkGlobalAdmin(currentUser, true);
    await this.userModel.update(
      { id: body.id },
      {
        nickname: body.nickname,
        email: body.email,
        mobile: body.mobile,
        updaterId: currentUser.id
      }
    );
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
    const isGlobalAdmin = await this.checkGlobalAdmin(currentUser, true);
    const [users, totalCount] = await this.userModel.findAndCount({
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
    if (totalCount === 0) return { totalCount, list: [] };
    const userIds = users.map(user => user.id);
    const updaterIds = users.map(user => user.updaterId || user.id); // 无最后更新人则为自己注册
    const updaterUsersBaseInfoMap = await this.getUsersBaseInfoMapByIds(updaterIds);
    const userRolesMap = await this.authService.getRolesMapByUserIds(userIds);
    const userList = users.map(user => {
      const updater = updaterUsersBaseInfoMap.get(user.updaterId || user.id);
      const roles = userRolesMap.get(user.id);
      console.log(roles);
      return {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        mobile: user.mobile,
        updaterNickname: updater.nickname || user.nickname,
        enableEdit: isGlobalAdmin || user.id === currentUser.id,
        roleNames: (roles && roles.map(role => role.name)) || [],
        roleCodes: (roles && roles.map(role => role.code)) || []
      };
    });
    return {
      totalCount,
      list: userList
    };
  }

  /**
   * 根据用户ID获取所有角色列表，并标记不可修改及已使用角色
   * @param id: 用户ID
   * @return Promise<UserRoles[]>: 角色信息包含能否修改及是否已开启
   */
  public async getUserRoles(id: number): Promise<UserRoles[]> {
    const allRoles = await this.roleService.getAllRoles();
    const userRoles = await this.roleService.getRolesByUserId(id);
    const checkedRoleIds = userRoles.map(userRole => userRole.id);
    return allRoles.map(role => {
      const r: UserRoles = {
        id: role.id,
        name: role.name,
        description: role.description,
        code: role.code,
        status: role.status,
        type: role.type,
        checked: false,
        disabled: false
      };
      if (checkedRoleIds.includes(role.id)) {
        r.checked = true;
      }
      return r;
    });
  }

  /**
   * 更新角色下权限
   * @param currentUser: 当前登录用户
   * @param userId: 用户ID
   * @param roleIds: 角色ID列表
   * @return Promise<void>
   */
  public async updateUserRoles(currentUser: UserModel, userId: number, roleIds: number[]): Promise<void> {
    await getManager().transaction(async (entityManage: EntityManager) => {
      // 删除用户下所有原有角色
      await entityManage.update(UserRoleModel, { userId }, { isDeleted: 1 });
      const saveDoc = roleIds.map(roleId => ({
        userId,
        roleId
      }));
      // 批量添加角色信息
      await entityManage.getRepository(UserRoleModel).save(saveDoc, { chunk: 1000 });
    });
  }
}

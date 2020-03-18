import { forwardRef, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { PermissionService } from '@/modules/permission/permission.service';
import { RoleService } from '@/modules/role/role.service';
import { UserModel } from '@/modules/user/user.model';
import { RoleItemDto, PermissionItemDto, TokenDto, UsersRolesFormatDto } from '@/modules/auth/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermissionModel, UserRoleModel } from '@/modules/auth/auth.model';
import { In, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AUTH } from '@/app.config';
import { BaseUserDto, SignInDto } from '@/modules/user/user.dto';
import { HttpUnauthorizedError } from '@/errors/unauthorized.error';
import { CustomError } from '@/errors/custom.error';
import Utils from '../../utils/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRoleModel)
    private readonly userRoleModel: Repository<UserRoleModel>,
    @InjectRepository(RolePermissionModel)
    private readonly rolePermissionModel: Repository<RolePermissionModel>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 加密方法
   * @param password: 密码明文字符串
   * @return string
   */
  public static encryptPassword(password: string): string {
    return Utils.encodeMd5(Utils.encodeBase64(password));
  }

  /**
   * 根据用户ID获取其所有角色信息
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
    const roleIds = userRoles.map((userRole: UserRoleModel): number => userRole.roleId);
    return await this.roleService.getRolesByIds(roleIds);
  }

  /**
   * 根据用户ID获取其所有权限信息
   * @param id: 用户ID
   * @return Promise<PermissionItemDto[]>
   */
  public async getPermissionsByUserId(id: number): Promise<PermissionItemDto[]> {
    const roles = await this.getRolesByUserId(id);
    if (!roles.length) return [];
    const roleIds = roles.map((role: RoleItemDto): number => role.id);
    const rolePermissions = await this.rolePermissionModel.find({
      where: {
        roleId: In(roleIds),
        isDeleted: 0
      }
    });
    const permissionIds = rolePermissions.map(rolePermission => rolePermission.permissionId);
    return await this.permissionService.getPermissionsByIds(permissionIds);
  }

  /**
   * 根据用户ID列表批量获取所有角色信息
   * @param ids: 用户ID列表
   * @return Promise<UsersRolesFormatDto[]>: 格式化好的批量用户包含的角色信息
   */
  public async getRolesByUserIds(ids: number[]): Promise<UsersRolesFormatDto[]> {
    if (ids.length > 1000)
      throw new CustomError({ message: '批量查询的用户ID过多' }, HttpStatus.INTERNAL_SERVER_ERROR);
    const usersRoles = await this.userRoleModel.find({
      where: {
        userId: In(ids),
        isDeleted: 0
      }
    });
    if (!usersRoles.length) return [];
    const roleIds = usersRoles.map((userRole: UserRoleModel): number => userRole.roleId);
    const roles = await this.roleService.getRolesByIds(roleIds);
    const usersRolesFormat: UsersRolesFormatDto[] = ids.map(userId => ({
      userId: userId,
      roles: []
    }));
    const roleMap = new Map();
    roles.forEach(role => roleMap.set(role.id, role));
    usersRolesFormat.forEach(item => {
      usersRoles.forEach((userRole, index) => {
        if (item.userId === userRole.userId) {
          item.roles.push(roleMap.get(userRole.roleId));
          usersRoles.splice(index, 1);
        }
      });
    });
    return usersRolesFormat;
  }

  /**
   * 根据用户ID列表批量获取所有角色信息（Map存储）
   * @param ids: 用户ID列表
   * @return Promise<Map<number, RoleItemDto>>: 用户ID => 角色信息列表
   */
  public async getRolesMapByUserIds(ids: number[]): Promise<Map<number, RoleItemDto[]>> {
    const usersRolesFormat = await this.getRolesByUserIds(ids);
    const userRoleMap = new Map();
    if (!usersRolesFormat.length) return userRoleMap;
    usersRolesFormat.forEach(userRoles => userRoleMap.set(userRoles.userId, userRoles.roles));
    return userRoleMap
  }

  /**
   * 创建JWT Token
   * @param user: 用户对象
   * @return Promise<TokenDto>
   */
  public async createToken(user: UserModel | BaseUserDto): Promise<TokenDto> {
    const permissions = await this.getPermissionsByUserId(user.id);
    const { id, username, nickname } = user;
    const data = {
      id,
      username,
      nickname,
      permissions: (permissions.length && permissions.map(item => item.code)) || []
    };
    const accessToken = this.jwtService.sign(data);
    return {
      accessToken,
      expireIn: AUTH.expiresIn
    }
  }

  /**
   * 刷新JWT Token
   * @param token: JWT Token字符串
   * @return Promise<TokenDto>
   */
  public async refreshToken(token: string): Promise<TokenDto> {
    try {
      const data = JSON.parse(Utils.encodeBase64(token.split('.')[1]));
      const user = await this.userService.getUserBaseInfoById(data.id);
      return this.createToken(user);
    } catch (error) {
      return null;
    }
  }

  /**
   * 通过用户名+密码登录
   * @param signInUser: 用户名+密码传输对象
   * @return Promise<TokenDto>
   */
  public async signIn(signInUser: SignInDto): Promise<TokenDto> {
    const user = await this.userService.getUserByUsername(signInUser.username);
    if (!(user && (user.password || AuthService.encryptPassword(AUTH.defaultPassword)) === AuthService.encryptPassword(signInUser.password)))
      throw new HttpUnauthorizedError('用户名或密码不正确');
    return this.createToken(user);
  }
}
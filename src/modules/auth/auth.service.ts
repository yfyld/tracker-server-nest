import { PermissionModel } from './../permission/permission.model';
import { MemberModel } from './../project/project.model';

import { SignUpDto } from './auth.dto';
import { forwardRef, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { UserModel } from '@/modules/user/user.model';
import { RoleItemDto, PermissionItemDto, TokenDto, UsersRolesFormatDto, SignInDto } from '@/modules/auth/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AUTH } from '@/app.config';
import { BaseUserDto } from '@/modules/user/user.dto';
import { HttpUnauthorizedError } from '@/errors/unauthorized.error';
import { CustomError } from '@/errors/custom.error';
import Utils from '../../utils/utils';
import { SingleLoginService } from '@/providers/singleLogin/single-login.service';
import { TokenResult } from '../user/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userModel: Repository<UserModel>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(MemberModel)
    private readonly memberModel: Repository<MemberModel>,
    @InjectRepository(PermissionModel)
    private readonly permissionModel: Repository<PermissionModel>,

    private readonly jwtService: JwtService,
    private readonly singleLoginService: SingleLoginService
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
  // public async getRolesByUserId(id: number): Promise<RoleItemDto[]> {
  //   const userRoles = await this.userRoleModel.find({
  //     where: {
  //       userId: id,
  //       isDeleted: 0
  //     }
  //   });
  //   if (!userRoles.length) return [];
  //   const roleIds = userRoles.map((userRole: UserRoleModel): number => userRole.roleId);
  //   return await this.roleService.getRolesByIds(roleIds);
  // }

  /**
   * 根据用户ID获取其所有权限信息
   * @param id: 用户ID
   * @return Promise<PermissionItemDto[]>
   */
  public async getPermissionsByUserId(id: number): Promise<PermissionItemDto[]> {
    const { roles } = await this.userModel.findOne({
      where: {
        id
      },
      relations: ['roles', 'roles.permissions']
    });
    return roles.reduce((total, item) => {
      total = total.concat(item.permissions);
      return total;
    }, []);
  }

  /**
   * 根据用户ID列表批量获取所有角色信息
   * @param ids: 用户ID列表
   * @return Promise<UsersRolesFormatDto[]>: 格式化好的批量用户包含的角色信息
   */
  // public async getRolesByUserIds(ids: number[]): Promise<UsersRolesFormatDto[]> {
  //   if (ids.length > 1000) throw new CustomError({ message: '批量查询的用户ID过多' }, HttpStatus.INTERNAL_SERVER_ERROR);
  //   const usersRoles = await this.userRoleModel.find({
  //     where: {
  //       userId: In(ids),
  //       isDeleted: 0
  //     }
  //   });
  //   if (!usersRoles.length) return [];
  //   const roleIds = usersRoles.map((userRole: UserRoleModel): number => userRole.roleId);
  //   const roles = await this.roleService.getRolesByIds(roleIds);
  //   const usersRolesFormat: UsersRolesFormatDto[] = ids.map(userId => ({
  //     userId: userId,
  //     roles: []
  //   }));
  //   const roleMap = new Map();
  //   roles.forEach(role => roleMap.set(role.id, role));
  //   usersRolesFormat.forEach(item => {
  //     usersRoles.forEach((userRole, index) => {
  //       if (item.userId === userRole.userId) {
  //         item.roles.push(roleMap.get(userRole.roleId));
  //         usersRoles.splice(index, 1);
  //       }
  //     });
  //   });
  //   return usersRolesFormat;
  // }

  /**
   * 根据用户ID列表批量获取所有角色信息（Map存储）
   * @param ids: 用户ID列表
   * @return Promise<Map<number, RoleItemDto>>: 用户ID => 角色信息列表
   */
  // public async getRolesMapByUserIds(ids: number[]): Promise<Map<number, RoleItemDto[]>> {
  //   const usersRolesFormat = await this.getRolesByUserIds(ids);
  //   const userRoleMap = new Map();
  //   if (!usersRolesFormat.length) return userRoleMap;
  //   usersRolesFormat.forEach(userRoles => userRoleMap.set(userRoles.userId, userRoles.roles));
  //   return userRoleMap;
  // }

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
      nickname
    };
    const accessToken = this.jwtService.sign(data);
    return {
      accessToken,
      expireIn: AUTH.expiresIn
    };
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
   *注册
   *
   * @param {SignUpDto} user
   * @returns {Promise<TokenDto>}
   * @memberof AuthService
   */
  public async signUp(user: SignUpDto): Promise<TokenDto> {
    if (!user.username) {
      user.username = user.mobile;
    }
    const newUser = await this.userService.addUser(user);
    return this.createToken(newUser);
  }

  /**
   * 通过用户名+密码登录
   * @param signInUser: 用户名+密码传输对象
   * @return Promise<TokenDto>
   */
  public async signIn(signInUser: SignInDto): Promise<TokenDto> {
    const user = await this.userService.getUserByUsername(signInUser.username);
    const aaa = AuthService.encryptPassword(signInUser.password);
    if (
      !(
        user &&
        (user.password || AuthService.encryptPassword(AUTH.defaultPassword)) ===
          AuthService.encryptPassword(signInUser.password)
      )
    )
      throw new HttpUnauthorizedError('用户名或密码不正确');
    return this.createToken(user);
  }

  public async getCookieName(): Promise<string> {
    return await this.singleLoginService.getCookieName();
  }

  public async singleSignOn(cookie): Promise<TokenDto> {
    const userInfo = await this.singleLoginService.getUserInfo(cookie);
    const user = await this.userModel.findOne({
      select: ['password', 'id', 'username', 'nickname'],
      where: {
        username: userInfo.username
      }
    });
    if (user) {
      return this.createToken(user);
    } else {
      const newUser = await this.userService.addUser({
        mobile: userInfo.mobile,
        username: userInfo.username,
        nickname: userInfo.nickname,
        password: Utils.generatePassword(8)
      });
      return this.createToken(newUser);
    }
  }

  public async getPermissionByUserAndProjectId(userId: number, projectId: number) {
    const member = await this.memberModel
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('userId = :userId', { userId })
      .where('projectId = :projectId', { projectId })
      .getMany();
    const allPermissions = member.reduce((total, item) => {
      total = total.concat(item.role.permissions.map(val => val.code));
      return total;
    }, []);

    const permissions = await this.permissionModel.find();
    return;
  }

  public async validateProjectPermission(userId: number, projectId: number): Promise<string[]> {
    const member = await this.memberModel
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('userId = :userId and projectId = :projectId', { userId, projectId })
      .getMany();
    return member.reduce((total, item) => {
      total = total.concat(item.role.permissions.map(val => val.code));
      return total;
    }, []);
  }
}
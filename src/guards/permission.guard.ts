import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { HttpForbiddenError } from '@/errors/forbidden.error';
import { UserService } from '@/modules/user/user.service';
import { UserModel } from '@/modules/user/user.model';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('AuthService') private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = [
      ...(this.reflector.get<string[]>('permissions', context.getClass()) || []),
      ...(this.reflector.get<string[]>('permissions', context.getHandler()) || [])
    ];
    if (permissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user || !user.permissions) {
      this.handleError();
      return false;
    }

    const projectId = request.params.projectId || request.body.projectId || request.query.projectId;
    if (projectId) {
      const allProjectPermissions = await this.authService.validateProjectPermission(
        request.user.id,
        Number(projectId)
      );

      user.permissions.push(...allProjectPermissions);
    }

    const hasPermission = () => {
      if (permissions.length === 1) {
        return user.permissions.includes(permissions[0]);
      } else {
        return user.permissions.some(permission => permissions.includes(permission));
      }
    };

    if (hasPermission()) {
      return true;
    }

    this.handleError();
    return false;
  }

  /**
   * @function handleError
   * @description 如果解析出的数据对不上，则判定为无效
   */
  handleError() {
    throw new HttpForbiddenError();
  }
}

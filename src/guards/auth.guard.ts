import { RedisService } from 'nestjs-redis';
import { CUSTOM_TOKEN_KEY } from '@/constants/common.constant';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { HttpUnauthorizedError } from '@/errors/unauthorized.error';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from '@/modules/auth/auth.service';

/**
 * @class JwtAuthGuard
 * @classdesc 检验规则：Token 是否存在 -> Token 是否在有效期内 -> Token 解析出的数据是否对的上
 * @example @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService, private readonly redisService: RedisService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      if (request.cookies && request.cookies[CUSTOM_TOKEN_KEY]) {
        request.headers.authorization = `Bearer ${request.cookies[CUSTOM_TOKEN_KEY]}`;
      }
      return await super.canActivate(context);
    } catch (TokenExpiredError) {
      if (TokenExpiredError.response.error === 'jwt expired') {
        const request = context.switchToHttp().getRequest();

        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

        const result = await this.authService.refreshToken(token);
        // tslint:disable-next-line: max-line-length
        if (result) {
          request.headers.authorization = `Bearer ${result.accessToken}`;
          return await super.canActivate(context);
        }
      }
      return false;
    }
  }

  /**
   * @function handleRequest
   * @description 如果解析出的数据对不上，则判定为无效
   */
  handleRequest(error, authInfo, errInfo) {
    if (authInfo && !error && !errInfo) {
      return authInfo;
    } else {
      throw error || new HttpUnauthorizedError(null, errInfo && errInfo.message);
    }
  }
}

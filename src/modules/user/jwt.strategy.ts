import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpUnauthorizedError } from '@/errors/unauthorized.error';
import { UserService } from './user.service';
import { AUTH } from '@/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AUTH.jwtTokenSecret
    });
  }
  /**
   * Refactor: 去掉密码校验（Gavin）
   * @param payload: JWT Token解析出的数据，包含：id/username/nickname/permissions/iat/exp
   * @author Gavin<wenzhang@91jkys.com>
   * @date 2020-03-11
   */
  async validate(payload: any) {
    // const data = await this.userService.validateAuthData(payload);
    const data = payload;
    if (data) {
      return data;
    } else {
      throw new HttpUnauthorizedError();
    }
  }
}

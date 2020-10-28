import { IS_LOGIN } from './../../constants/common.constant';
import { COOKIE_HOST } from '../../app.config';
import { AuthService } from '@/modules/auth/auth.service';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Body, Controller, forwardRef, HttpStatus, Inject, Post, Get, Query, Res } from '@nestjs/common';
import { HttpProcessor } from '@/decotators/http.decotator';
import { BaseUserDto } from '@/modules/user/user.dto';
import { TokenDto, SignInDto, SignUpDto } from './auth.dto';
import { UserService } from '@/modules/user/user.service';
import { Cookie } from '@/decotators/cookie.decorators';
import { Response } from 'express';
import { BASE_URL } from '@/app.config';
import { CUSTOM_TOKEN_KEY } from '@/constants/common.constant';

@ApiUseTags('权限')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ title: '检测 Token', description: '' })
  @Post('check')
  @HttpProcessor.handle('检测 Token')
  checkToken(): string {
    return 'ok';
  }

  @ApiOperation({ title: '注册', description: '' })
  @HttpProcessor.handle('注册')
  @Post('/signUp')
  async signUp(@Body() user: SignUpDto): Promise<TokenDto> {
    return this.authService.signUp(user);
  }

  @ApiOperation({ title: '登陆', description: '' })
  @Post('/signIn')
  @HttpProcessor.handle({ message: '登陆', error: HttpStatus.BAD_REQUEST })
  async signIn(@Body() body: SignInDto, @Res() response: Response): Promise<Response> {
    const result = await this.authService.signIn(body);
    response.cookie(CUSTOM_TOKEN_KEY, result.accessToken, {
      maxAge: result.expireIn,
      httpOnly: true,
      path: '/',
      domain: COOKIE_HOST
    });

    response.cookie(IS_LOGIN, true, {
      maxAge: result.expireIn,
      httpOnly: false,
      path: '/',
      domain: COOKIE_HOST
    });
    return response.json({
      result: {},
      status: 200
    });
  }

  @Get('/signOut')
  @HttpProcessor.handle({ message: '注销', error: HttpStatus.BAD_REQUEST })
  async signOut(@Res() response: Response): Promise<Response> {
    const cookieKey = await this.authService.getCookieName();
    response.cookie(cookieKey, '', {
      maxAge: 100000,
      httpOnly: true,
      path: '/',
      domain: COOKIE_HOST
    });
    response.cookie(CUSTOM_TOKEN_KEY, '', {
      maxAge: 100000,
      httpOnly: true,
      path: '/',
      domain: COOKIE_HOST
    });
    response.cookie(IS_LOGIN, false, {
      maxAge: 100000,
      httpOnly: false,
      path: '/',
      domain: COOKIE_HOST
    });
    return response.json({
      result: {},
      status: 200
    });
  }

  @Get('single-signon')
  async singleSignOn(@Cookie() cookie, @Query('from') fromURL, @Res() response: Response): Promise<void> {
    const result = await this.authService.singleSignOn(cookie);
    response.cookie(CUSTOM_TOKEN_KEY, result.accessToken, {
      maxAge: result.expireIn,
      httpOnly: true,
      path: '/',
      domain: COOKIE_HOST
    });

    response.cookie(IS_LOGIN, true, {
      maxAge: result.expireIn,
      httpOnly: false,
      path: '/',
      domain: COOKIE_HOST
    });

    return response.redirect(302, fromURL || `${BASE_URL.webUrl}/index.html#/project-list`);
  }
}

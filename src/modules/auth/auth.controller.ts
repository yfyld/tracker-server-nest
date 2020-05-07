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
  signIn(@Body() body: SignInDto): Promise<TokenDto> {
    return this.authService.signIn(body);
  }

  @Get('single-signon')
  async singleSignOn(@Cookie() cookie, @Query('from') fromURL, @Res() response: Response): Promise<void> {
    const result = await this.authService.singleSignOn(cookie);
    response.cookie(CUSTOM_TOKEN_KEY, result.accessToken, {
      maxAge: result.expireIn,
      httpOnly: false,
      path: '/'
    });
    return response.redirect(303, fromURL || `${BASE_URL.webUrl}/project-list`);
  }
}

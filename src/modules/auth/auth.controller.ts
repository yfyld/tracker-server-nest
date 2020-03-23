import { AuthService } from '@/modules/auth/auth.service';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Body, Controller, forwardRef, HttpStatus, Inject, Post } from '@nestjs/common';
import { HttpProcessor } from '@/decotators/http.decotator';
import { BaseUserDto, SignInDto, SignUpDto } from '@/modules/user/user.dto';
import { TokenDto } from './auth.dto';
import { UserService } from '@/modules/user/user.service';

@ApiUseTags('权限')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ title: '检测 Token', description: '' })
  @Post('check')
  @HttpProcessor.handle('检测 Token')
  checkToken(): string {
    return 'ok';
  }

  @ApiOperation({ title: '登陆', description: '' })
  @Post('/signIn')
  @HttpProcessor.handle({ message: '登陆', error: HttpStatus.BAD_REQUEST })
  signIn(@Body() body: SignInDto): Promise<TokenDto> {
    return this.authService.signIn(body);
  }
}
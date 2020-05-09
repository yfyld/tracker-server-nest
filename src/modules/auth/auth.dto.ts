import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Optional } from '@nestjs/common';

export class TokenDto {
  accessToken: string;

  expireIn: number;
}

export class RoleItemDto {
  id: number;
  name: string;
  description?: string;

  code: string;

  status?: number;

  type: number;

  updaterId: number;

  updatedAt: Date;
}

export class UsersRolesFormatDto {
  userId: number;

  roles: RoleItemDto[];
}

export class PermissionItemDto {
  id: number;
  name: string;
  description?: string;

  code: string;

  status?: number;

  type: number;

  updaterId: number;

  updatedAt: Date;
}

export class SignInDto {
  @IsNotEmpty({ message: '账号不能为空' })
  @IsString({ message: '账号必须为字符串' })
  username: string;

  @IsNotEmpty({ message: '账号不能为空' })
  @IsString({ message: '账号必须为字符串' })
  @Length(6, 50, { message: '至少6个字符组成' })
  password: string;
}

export class SignUpDto {
  @IsNotEmpty({ message: '昵称不能为空' })
  @IsString({ message: '昵称必须为字符串' })
  nickname: string;

  @IsString({ message: '手机必须为字符串' })
  @IsNotEmpty({ message: '手机不能为空' })
  mobile: string;

  @Optional()
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须为字符串' })
  @Length(6, 50, { message: '至少6个字符组成' })
  password: string;
}

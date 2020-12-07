import { Optional } from '@nestjs/common';
import { IsString, IsNotEmpty, Length, IsOptional, IsInt, IsBoolean, IsArray, MinLength } from 'class-validator';

export class TokenDto {
  accessToken: string;

  expiresIn: number;
}

export class UpdateUserDto {
  @IsInt({ message: '必须传入用户ID' })
  id: number;

  @IsString({ message: '账号必须为字符串' })
  nickname: string;

  @IsString({ message: '邮箱必须为字符串' })
  email: string;

  @IsString({ message: '手机号必须为字符串' })
  mobile: string;
  @IsString({ message: '密码必须为超6位字符串' })
  @Optional()
  @MinLength(6)
  password?: string;
}

export class UpdateUserByAdminDto extends UpdateUserDto {
  roleIds: number[];
}

export class UserListReqDto {
  @IsOptional()
  nickname?: string;
  @IsOptional()
  username?: string;
}

export class BaseUserDto {
  @IsInt()
  id: number;

  @IsString()
  username: string;

  @IsString()
  nickname: string;

  @IsString()
  email: string;

  @IsString()
  mobile: string;
}

export class UserListItemDto extends BaseUserDto {}

export class UpdateUserRoles {
  @IsInt()
  userId: number;

  @IsArray()
  roleIds: number[];
}

export class UserRoles {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsString()
  code: string;

  @IsInt()
  status: number;

  @IsInt()
  type: number;

  @IsBoolean()
  checked: boolean;

  @IsBoolean()
  disabled: boolean;
}

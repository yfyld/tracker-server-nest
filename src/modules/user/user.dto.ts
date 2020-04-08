import { IsString, IsNotEmpty, Length, IsOptional, IsInt, IsBoolean, IsArray } from 'class-validator';

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

  @IsString({ message: '手机号号必须为字符串' })
  mobile: string;
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

export class UserListItemDto extends BaseUserDto {
  @IsString()
  updaterNickname: string;

  @IsBoolean()
  enableEdit: boolean; // 展示编辑按钮？true/false: 展示/不展示

  @IsString()
  roleCodes: string[];

  @IsString()
  roleNames: string[];
}

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

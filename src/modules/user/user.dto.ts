import { IsString, IsNotEmpty, Length, IsOptional, IsInt, IsBoolean, IsArray } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiModelProperty()
  accessToken: string;
  @ApiModelProperty()
  expiresIn: number;
}

export class UpdateUserDto {
  @ApiModelProperty()
  @IsInt({ message: '必须传入用户ID' })
  id: number;

  @ApiModelProperty()
  @IsString({ message: '账号必须为字符串' })
  nickname: string;

  @ApiModelProperty()
  @IsString({ message: '邮箱必须为字符串' })
  email: string;

  @ApiModelProperty()
  @IsString({ message: '手机号号必须为字符串' })
  mobile: string;
}

export class UserListReqDto {
  @ApiModelProperty()
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
  @ApiModelProperty()
  updaterNickname: string;

  @IsBoolean()
  @ApiModelProperty()
  enableEdit: boolean; // 展示编辑按钮？true/false: 展示/不展示

  @IsString()
  @ApiModelProperty()
  roleCodes: string[];

  @IsString()
  @ApiModelProperty()
  roleNames: string[];
}

export class SignInDto {
  @ApiModelProperty()
  @IsNotEmpty({ message: '账号不能为空' })
  @IsString({ message: '账号必须为字符串' })
  username: string;

  @ApiModelProperty()
  @IsNotEmpty({ message: '账号不能为空' })
  @IsString({ message: '账号必须为字符串' })
  @Length(6, 50, { message: '至少6个字符组成' })
  password: string;
}

export class SignUpDto {
  @ApiModelProperty()
  @IsNotEmpty({ message: '账号不能为空' })
  @IsString({ message: '账号必须为字符串' })
  username: string;

  @ApiModelProperty()
  @IsString({ message: '账号必须为字符串' })
  nickname: string;

  @ApiModelProperty()
  @IsNotEmpty({ message: '账号不能为空' })
  @IsString({ message: '账号必须为字符串' })
  @Length(6, 50, { message: '至少6个字符组成' })
  password: string;
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

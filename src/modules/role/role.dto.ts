import {
  IsInt,
  IsString,
  Length,
  MaxLength,
  Min,
  Max,
  IsEnum,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsDate,
  IsBoolean,
  IsArray
} from 'class-validator';
import { MALICIOUS_OPS_MESSAGE } from '@/constants/common.constant';

enum RoleType {
  API = 1,
  Router,
  Function
}

// 用于添加与继承
export class BaseRoleDto {
  @IsString()
  @Length(2, 32, {
    message: '角色名称最少为2个字，最多为32个字'
  })
  name: string;

  @IsString()
  @MaxLength(256, {
    message: '角色描述最多为256个字'
  })
  description?: string;

  @IsString()
  @Length(2, 32, MALICIOUS_OPS_MESSAGE)
  code: string;

  @IsInt()
  @IsOptional()
  @Max(255, MALICIOUS_OPS_MESSAGE)
  status?: number;

  @IsEnum(RoleType, MALICIOUS_OPS_MESSAGE)
  type: number;
}

export class AddRoleDto extends BaseRoleDto {
  @IsInt()
  creatorId: number;

  @IsInt()
  updaterId: number;
}

export class deleteRoleDto {
  @IsInt()
  id: number;

  @IsInt()
  updaterId: number;

  @IsInt()
  @Min(0)
  @Max(1)
  isDeleted?: number;
}

export class UpdateRoleDto extends BaseRoleDto {
  @IsInt()
  id: number;
}

export class UpdateRolePermissions {
  @IsInt()
  roleId: number;

  @IsArray()
  permissionIds: number[];
}

export class QueryRoleDto {
  @IsOptional()
  @IsString({ message: '角色名必须为字符串' })
  @Length(0, 32, { message: '请不要超过32个字符' })
  name?: string;
  @IsOptional()
  @IsString({ message: '角色CODE必须为字符串' })
  code?: string;
}

export class RoleItemDto extends BaseRoleDto {}

export class RoleListItemDto extends BaseRoleDto {}

export class RolePermission {
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

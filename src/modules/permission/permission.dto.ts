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
  IsDate
} from 'class-validator';
import { MALICIOUS_OPS_MESSAGE } from '@/constants/common.constant';

enum PermissionType {
  API = 1,
  Router,
  Function
}

// 用于添加与继承
export class BasePermissionDto {
  @IsString()
  @Length(2, 32, {
    message: '权限名称最少为2个字，最多为32个字'
  })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(256, {
    message: '权限描述最多为256个字'
  })
  description?: string;

  @IsString()
  @Length(2, 32, MALICIOUS_OPS_MESSAGE)
  code: string;

  @IsInt()
  @IsOptional()
  @Max(255, MALICIOUS_OPS_MESSAGE)
  status?: number;

  @IsEnum(PermissionType, MALICIOUS_OPS_MESSAGE)
  type: number;
}

export class AddPermissionDto extends BasePermissionDto {
  @IsInt()
  creatorId: number;

  @IsInt()
  updaterId: number;
}

export class deletePermissionDto {
  @IsInt()
  id: number;

  @IsInt()
  updaterId: number;

  @IsInt()
  @Min(0)
  @Max(1)
  isDeleted?: number;
}

export class UpdatePermissionDto extends BasePermissionDto {
  @IsInt()
  id: number;
}

export class QueryPermissionDto {
  @IsOptional()
  @IsString({ message: '权限名必须为字符串' })
  @Length(0, 32, { message: '请不要超过32个字符' })
  name?: string;
}

export class PermissionItemDto extends BasePermissionDto {
  @IsInt()
  id: number;

  @IsDate()
  updatedAt: Date;
}

export class PermissionListItemDto extends BasePermissionDto {}

export class UserPermissionCodesDto {
  projectId: number;
  permissionCodesMap: string[];
}

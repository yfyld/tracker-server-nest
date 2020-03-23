import { ApiModelProperty } from '@nestjs/swagger';
import { options } from 'tsconfig-paths/lib/options';
import { defaultCacheOptions } from '@nestjs/common/cache/default-options';

export class TokenDto {
  @ApiModelProperty()
  accessToken: string;
  @ApiModelProperty()
  expireIn: number;
}

export class RoleItemDto {
  @ApiModelProperty()
  id: number;
  @ApiModelProperty({ description: '角色名称' })
  name: string;
  @ApiModelProperty({ description: '描述' })
  description?: string;
  @ApiModelProperty()
  code: string;
  @ApiModelProperty()
  status?: number;
  @ApiModelProperty()
  type: number;
  @ApiModelProperty()
  updaterId: number;
  @ApiModelProperty()
  updatedAt: Date;
}

export class UsersRolesFormatDto {
  @ApiModelProperty()
  userId: number;
  @ApiModelProperty()
  roles: RoleItemDto[]
}

export class PermissionItemDto {
  @ApiModelProperty()
  id: number;
  @ApiModelProperty({ description: '角色名称' })
  name: string;
  @ApiModelProperty({ description: '描述' })
  description?: string;
  @ApiModelProperty()
  code: string;
  @ApiModelProperty()
  status?: number;
  @ApiModelProperty()
  type: number;
  @ApiModelProperty()
  updaterId: number;
  @ApiModelProperty()
  updatedAt: Date;
}


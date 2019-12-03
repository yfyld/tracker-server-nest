import { IsNotEmpty, IsDefined, IsInt, IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { UserModel } from '../user/user.model';

export class AddProjectDto {
  @IsDefined()
  @IsNotEmpty({ message: '项目名称不能为空' })
  name: string;

  @IsOptional()
  @IsString({ message: '账号必须为字符串' })
  description?: string;

  @IsOptional()
  @IsString({ message: '封面必须为字符串' })
  image?: string;
}

export class AddProjectResDto {
  id: number;
}

export class AddMembersDto {
  @IsNotEmpty({ message: '项目id不能为空' })
  projectId: number;
  @IsNotEmpty({ message: 'memberIds不能为空' })
  memberIds: number[];
  @IsNotEmpty({ message: 'roleCode不能为空' })
  roleCode: string;
}

export class DeleteMembersDto {
  @IsNotEmpty({ message: '项目id不能为空' })
  projectId: number;
  @IsNotEmpty({ message: 'memberIds不能为空' })
  memberIds: number[];
}

export class UpdateMembersDto {
  @IsNotEmpty({ message: '项目id不能为空' })
  projectId: number;
  @IsNotEmpty({ message: 'memberIds不能为空' })
  memberIds: number[];
  @IsNotEmpty({ message: 'roleCode不能为空' })
  roleCode: string;
}

export class QueryProjectsDto {
  @IsOptional()
  @IsString({ message: 'projectName必须为字符串' })
  projectName?: string;
}

export class ProjectDto {
  id: number;
  name: string;
  image: string;
  description: string;
  creator: UserModel;
  members: any[];
}

export class UpdateProjectDto {
  @IsNumber()
  id: number;

  @IsString({ message: '项目名必须为字符串' })
  name: string;

  @IsOptional()
  @IsString({ message: '描述必须为字符串' })
  description: string;

  @IsOptional()
  @IsString({ message: '封面必须为字符串' })
  image: string;
}

export class AddSourcemapsDto {
  @IsDefined()
  @IsNotEmpty({ message: '项目id不能为空' })
  projectId: number;

  @IsDefined()
  files: {
    url: string;
    fileName: string;
  }[];

  @IsDefined()
  version: string;
  @IsDefined()
  hash: boolean;
}

export class ActionSourcemapsDto {
  @IsDefined()
  @IsNotEmpty({ message: '项目id不能为空' })
  projectId: number;

  @IsDefined()
  sourcemapIds: number[];

  @IsString({ message: 'actionType必须为字符串' })
  actionType: string;

  @IsBoolean({ message: 'hash必须为布尔值' })
  hash: boolean;

  @IsString({ message: 'version必须为字符串' })
  version: string;
}

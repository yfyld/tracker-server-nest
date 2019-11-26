import { IsNotEmpty, IsDefined, IsInt, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ProjectModel } from '../project/project.model';

export class AddTeamDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  public: boolean;
  members: number[];
}

export class TeamDto {
  @IsString()
  name: string;
  @IsNumber()
  id: string;
  @IsString()
  description: string;
}

export class QueryTeamListDto {
  @IsOptional()
  @IsString()
  name: string;

  relevance?: number;
}

export class UpdateTeamDto {
  @IsNumber()
  id: string;
  @IsNumber()
  creatorId: number;
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  public: boolean;
  members: number[];
}

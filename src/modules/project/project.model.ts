import { RoleModel } from './../user/user.model';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { UserModel } from '../user/user.model';

@Entity()
export class ProjectModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(type => UserModel, { cascade: true, onDelete: 'CASCADE' })
  creator: UserModel;
}

@Entity()
export class MemberModel {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(type => ProjectModel, { cascade: true, onDelete: 'CASCADE' })
  project: ProjectModel;
  @ManyToOne(type => UserModel, { cascade: true, onDelete: 'CASCADE' })
  user: UserModel;
  @ManyToOne(type => RoleModel, { cascade: true, onDelete: 'CASCADE' })
  role: RoleModel;
}

@Entity()
export class SourcemapModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @IsDefined()
  @IsString()
  @Column()
  url: string;
  @Column()
  version: string;

  @Column()
  hash: boolean;
  @Column()
  fileName: string;

  @ManyToOne(type => ProjectModel, { cascade: true, onDelete: 'CASCADE' })
  project: ProjectModel;
}

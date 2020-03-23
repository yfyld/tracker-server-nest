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
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserModel } from '../user/user.model';
import { RoleModel } from '../role/role.model';

@Entity()
export class ProjectModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  description: string;

  @Column({ default: 1 })
  status: number;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(type => UserModel, { cascade: true, onDelete: 'CASCADE' })
  creator: UserModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
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

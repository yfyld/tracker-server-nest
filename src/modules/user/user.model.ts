import { IsString, IsDefined, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { ProjectModel } from '../project/project.model';
import { Exclude } from 'class-transformer';
import { TeamModel } from '../team/team.model';
import { RoleModel } from '@/modules/role/role.model';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column()
  password: string;

  @ManyToMany(type => RoleModel)
  @JoinTable()
  roles: RoleModel[];

  @OneToMany(type => TeamModel, team => team.creator)
  teams: TeamModel[];

  @CreateDateColumn()
  createdAt: Date; // 创建时间

  @UpdateDateColumn()
  updatedAt: Date; // 更新时间

  @Column({ type: 'tinyint', default: 0, comment: '0/1:，软删：否/是' })
  isDeleted: number;
}

@Entity()
export class ProjectRoleModel {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(type => UserModel)
  @JoinColumn()
  user: UserModel;
  @OneToOne(type => RoleModel)
  @JoinColumn()
  role: RoleModel;
  @OneToOne(type => ProjectModel)
  @JoinColumn()
  project: ProjectModel;
}

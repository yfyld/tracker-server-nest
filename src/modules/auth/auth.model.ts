import { ProjectModel } from './../project/project.model';
import { RoleModel } from '@/modules/role/role.model';
import { UserModel } from '@/modules/user/user.model';
import { Column, Entity, Index, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

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

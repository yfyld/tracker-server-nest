import { IsDate, IsInt, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { PermissionModel } from '../permission/permission.model';

@Entity()
export class RoleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 128, comment: '角色名称' })
  name: string;

  @IsString()
  @Column({ type: 'varchar', length: 1024, comment: '角色描述，示例：该角色拥有查看所有项目权限' })
  description: string;

  @Index()
  @IsString()
  @Column({
    type: 'varchar',
    length: 128,
    default: 'GLOBAL_USER',
    comment: '角色Code，示例：GLOBAL_ADMIN/USER/GLOBAL_USER/PROJECT_XX'
  })
  code: string;

  @IsInt()
  @Column({ type: 'tinyint', unsigned: true, default: 1, comment: '状态：0/1：未启用/启用' })
  status: number;

  @IsInt()
  @Index()
  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 3,
    comment: '角色类型：1/2/3: 超管/平台管理员/平台用户，与code相同功能，tinyint更易于高性能检索'
  })
  type: number;

  @ManyToMany(type => PermissionModel)
  @JoinTable()
  permissions: PermissionModel[];

  @IsInt()
  @Column({ type: 'tinyint', default: 0, comment: '0/1:，软删：否/是' })
  isDeleted: number;

  @IsDate()
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}

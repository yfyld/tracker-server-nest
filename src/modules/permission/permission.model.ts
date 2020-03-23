import { IsDate, IsInt, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PermissionModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 128, comment: '权限名，示例：查看用户列表' })
  name: string;

  @IsString()
  @Column({ type: 'varchar', length: 1024, comment: '权限描述，示例：该权限能查看用户列表' })
  description: string;

  @Index()
  @IsString()
  @Column({ type: 'varchar', length: 128, comment: '权限Code，示例：API_PUT_USER/ROUTER_ADMIN__ROLE_MANAGE/FUNCTION_EDIT_USER，路由中的双下划线代表/' })
  code: string;

  @IsInt()
  @Column({ type: 'tinyint', unsigned: true, default: 1, comment: '状态：0/1：未启用/启用' })
  status: number;

  @IsInt()
  @Column({ type: 'tinyint', unsigned: true, comment: '权限类型：1/2/3: 接口/路由/功能（enum: API/Router/Function）' })
  type: number;

  @IsInt()
  @Column({ type: 'tinyint', default: 0, comment: '0/1:，软删：否/是' })
  isDeleted: number;

  @IsInt()
  @Column({ comment: '创建人ID' })
  creatorId: number;

  @IsInt()
  @Column({ comment: '最后更新人ID' })
  updaterId: number;

  @IsDate()
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn({ comment: '更新时间'} )
  updatedAt: Date;
}
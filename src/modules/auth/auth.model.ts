import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserRoleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int', comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ type: 'int', comment: '角色ID' })
  roleId: number;

  @Column({ type: 'tinyint', default: 0, comment: '0/1:，软删：否/是' })
  isDeleted: number;
}

@Entity()
export class RolePermissionModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int', comment: '角色ID' })
  roleId: number;

  @Index()
  @Column({ type: 'int', comment: '权限ID' })
  permissionId: number;

  @Column({ type: 'tinyint', default: 0, comment: '0/1:，软删：否/是' })
  isDeleted: number;
}
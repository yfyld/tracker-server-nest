import { IsDate, IsInt } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ModuleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128, comment: '模块名称' })
  name: string;

  @Column({ type: 'varchar', length: 1024, comment: '描述' })
  description: string;

  @IsDate()
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @IsInt()
  @Column({ type: 'tinyint', default: 0, comment: '0/1:，软删：否/是' })
  isDeleted: number;
}

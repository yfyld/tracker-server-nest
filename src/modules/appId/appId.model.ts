import { IsDate, IsInt, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AppIdModel {
  @PrimaryGeneratedColumn()
  appId: number;

  @Index()
  @Column({ type: 'varchar', length: 128, comment: '应用名称' })
  appName: string;

  @IsString()
  @Column({ type: 'varchar', length: 1024, comment: '业务线' })
  business: string;

  @Index()
  @IsString()
  @Column({
    type: 'varchar',
    length: 128,
    comment: '客户端类型'
  })
  clientType: string;

  @IsInt()
  @Column({ type: 'varchar', length: 128, comment: '从属端类型' })
  subordinateType: string;

  @IsInt()
  @Column({ type: 'varchar', length: 1024, comment: '描述' })
  description: string;

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

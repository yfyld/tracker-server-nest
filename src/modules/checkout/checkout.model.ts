import { IsDate, IsInt } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

@Entity()
export class CheckoutLogModel extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 128, comment: '日志Id' })
  logId: string;

  @Column({ type: 'varchar', length: 128, comment: '元数据Id' })
  trackId: string;

  @Column({ comment: '校验状态' })
  status: number;

  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 1024, comment: '备注' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

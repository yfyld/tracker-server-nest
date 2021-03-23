import { IsDate, IsInt } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

@Entity()
export class ChannelModel extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'id' })
  id: number;

  @Column({ comment: '渠道ID' })
  channelId: string;

  @Column({ type: 'varchar', length: 128, comment: '渠道名称' })
  name: string;

  @Column({ type: 'varchar', length: 128, comment: '渠道类型' })
  type: string;

  @Column({ type: 'varchar', length: 1024, comment: '业务线' })
  business: string;

  @Column({ type: 'varchar', length: 1024, comment: '来源' })
  source: string;

  @Column({ type: 'varchar', length: 1024, comment: '来源' })
  position: string;

  @Column({ type: 'varchar', length: 1024, comment: '活动' })
  activity: string;

  @Column({ type: 'varchar', length: 1024, comment: '内容' })
  content: string;

  @Column({ type: 'varchar', length: 1024, comment: '关键词' })
  keyword: string;

  @Column({ type: 'varchar', length: 1024, comment: '描述' })
  description: string;

  @IsDate()
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @IsInt()
  @Column({ type: 'tinyint', default: 0, comment: '0/1:，软删：否/是' })
  isDeleted: number;
}

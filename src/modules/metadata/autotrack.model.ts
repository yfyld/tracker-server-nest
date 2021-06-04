import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AutotrackModel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ comment: '无痕埋点的trackId' })
  code: string;
  @Column({ comment: '页面曝光/区域曝光/事件' })
  type: number;
  @Column({ comment: '圈选名称' })
  name: string;
  @Column({ comment: '描述' })
  description: string;
  @Column({ type: 'text', comment: '内容' })
  content: string;
  @Column({ comment: '链接' })
  herf: string;
  @Column({ comment: '截图' })
  img: string;

  @Column({ comment: '更新人' })
  editorId: number;

  @Column({ comment: '创建人' })
  userId: number;

  @Column({ comment: '关联有痕埋点的trackId' })
  metadataCode: string;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

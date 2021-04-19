import { IsString, IsDefined, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { ProjectModel } from '../project/project.model';

@Entity()
export class MetadataTagModel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
}

@Entity()
export class FieldModel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  code: string;
  @Column()
  type: string;
  @Column()
  status: number;
  @Column()
  name: string;
}

@Entity()
export class MetadataModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '埋点中文名' })
  name: string;

  @Column({ comment: 'trackId' })
  code: string;

  @Column({ comment: '夜班曝光:PAGE/事件:EVENT/区域曝光:VIEW/时长:DURATION/区域时长DURATION_VIEW' })
  type: number;

  @Column({ default: 0 })
  operatorType: number;

  @Column({ default: 1, comment: '启用状态0/1' })
  status: number;

  @Column({ default: 1, comment: '测试状态  1:未测试 2:通过 0:不通过' })
  checkoutStatus: number;

  @Column({ default: 1, comment: '自测状态   1:未测试 2:通过 0:不通过' })
  selfCheckoutStatus: number;

  @Column({ default: false })
  isDeleted: boolean;

  @Column()
  log: number;

  @Column()
  recentLog: number;

  @Column()
  logByApp: number;

  @Column()
  recentLogByApp: number;

  @Column()
  logByH5: number;
  @Column()
  recentLogByH5: number;

  @Column({ comment: '触发埋点的h5地址' })
  url: string;

  @Column({ comment: '埋点版本' })
  version: string;

  @Column({ comment: '埋点描述' })
  description: string;

  @ManyToOne(type => ProjectModel)
  project: ProjectModel;
  @Column()
  projectId: number;

  @ManyToMany(type => MetadataTagModel)
  @JoinTable()
  tags: MetadataTagModel[];

  @Column({ comment: '页面类型' })
  pageType: string;

  @Column({ comment: '业务模块' })
  moduleId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

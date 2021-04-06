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
  @ManyToOne(type => ProjectModel)
  project: ProjectModel;
  @Column()
  projectId: number;
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

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  type: number;

  @Column({ default: 0 })
  operatorType: number;

  @Column({ default: 1 })
  status: number;

  @Column({ default: 1 })
  checkoutStatus: number;

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

  @Column()
  url: string;

  @Column()
  description: string;

  @ManyToOne(type => ProjectModel)
  project: ProjectModel;
  @Column()
  projectId: number;

  @ManyToMany(type => MetadataTagModel)
  @JoinTable()
  tags: MetadataTagModel[];

  @Column()
  pageType: string;

  @Column()
  moduleId: number;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

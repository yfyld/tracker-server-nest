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

  @Column()
  status: number;

  @Column()
  log: number;

  @Column()
  recentLog: number;

  @Column()
  description: string;

  @ManyToOne(type => ProjectModel)
  project: ProjectModel;
  @Column()
  projectId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(type => MetadataTagModel)
  @JoinTable()
  tags: MetadataTagModel[];
}

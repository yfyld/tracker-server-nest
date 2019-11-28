import { ReportModel } from './../report/report.model';
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
  UpdateDateColumn,
  OneToOne
} from 'typeorm';
import { UserModel } from '../user/user.model';
import { ProjectModel } from '../project/project.model';

@Entity()
export class BoardModel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'mediumtext' })
  layout: string;

  @Column()
  status: number;

  @ManyToMany(type => ReportModel, report => report.boards)
  @JoinTable()
  reports: ReportModel[];

  @ManyToOne(type => UserModel, { cascade: true, onDelete: 'CASCADE' })
  creator: UserModel;

  @ManyToOne(type => ProjectModel)
  project: ProjectModel;
  @Column()
  projectId: number;

  @Column()
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

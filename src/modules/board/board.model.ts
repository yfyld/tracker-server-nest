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

  @Column()
  layout: string;

  @Column()
  status: number;

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

@Entity()
export class BoardReportModel {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(type => BoardModel)
  @JoinColumn()
  board: BoardModel;

  @OneToOne(type => ReportModel)
  @JoinColumn()
  report: ReportModel;

  @Column()
  dateType: string;

  @Column()
  dateStart: number;

  @Column()
  dateEnd: number;

  @Column()
  showType: string;

  @Column()
  timeType: string;

  @Column()
  subtitle: string;
}

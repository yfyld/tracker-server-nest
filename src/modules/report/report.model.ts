import { BoardModel } from './../board/board.model';
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
import { UserModel } from '../user/user.model';

@Entity()
export class ReportModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  model: string;

  @Column('text')
  data: string;

  @Column({ type: 'bigint' })
  dateStart: number;

  @Column({ type: 'bigint' })
  dateEnd: number;

  @Column()
  dateType: string;

  @Column()
  description: string;

  @ManyToOne(type => ProjectModel)
  project: ProjectModel;
  @Column()
  projectId: number;

  @ManyToMany(type => BoardModel, board => board.reports)
  boards: BoardModel[];

  @ManyToOne(type => UserModel, { cascade: true, onDelete: 'CASCADE' })
  creator: UserModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

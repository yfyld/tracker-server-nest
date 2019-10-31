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
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  dateStart: number;

  @Column()
  dateEnd: number;

  @Column()
  dateType: string;

  @Column()
  model: string;

  @Column()
  data: string;

  @Column()
  description: string;

  @ManyToOne(type => ProjectModel)
  project: ProjectModel;
  @Column()
  projectId: number;

  @ManyToOne(type => BoardModel)
  board: BoardModel;
  @Column()
  boardId: number;

  @ManyToOne(type => UserModel, { cascade: true, onDelete: 'CASCADE' })
  creator: UserModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

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

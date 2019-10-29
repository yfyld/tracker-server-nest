import { BoardModel } from '../board/board.model';
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
export class TeamModel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(type => UserModel)
  @JoinTable()
  members: UserModel[];

  @ManyToOne(type => UserModel, { cascade: true, onDelete: 'CASCADE' })
  creator: UserModel;
}

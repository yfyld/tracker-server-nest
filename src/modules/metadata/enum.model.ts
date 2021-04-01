import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EnumModel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  code: string;
  @Column({ type: 'text' })
  content: string;
  @Column()
  description: string;
}

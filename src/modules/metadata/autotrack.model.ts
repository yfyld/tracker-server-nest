import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AutotrackModel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  code: string;
  @Column({ type: 'text' })
  content: string;
  @Column()
  herf: string;
  @Column()
  img: string;
  @Column()
  metadata: string;
}

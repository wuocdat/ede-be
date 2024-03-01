import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ede_text: string;

  @Column({ nullable: true })
  vi_text: string;

  @Column({ default: false })
  correct: boolean;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ name: 'updated_by' })
  updatedBy: number;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}

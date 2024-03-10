import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ede_text: string;

  @Column()
  vi_text: string;

  @Column({ nullable: true, default: null })
  correct_ede_text: string;

  @Column({ default: false })
  correct: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: User;

  @Column({ name: 'updated_by' })
  updatedBy: number;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}

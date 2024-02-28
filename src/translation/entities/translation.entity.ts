import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  createdBy: number;

  @Column()
  createdAt: string;

  @Column()
  updatedBy: number;

  @Column()
  updatedAt: string;
}

import { ERole } from 'src/shared/enums/roles.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ERole, default: ERole.Editor })
  role: ERole;

  @Column({ default: true })
  isActive: boolean;
}

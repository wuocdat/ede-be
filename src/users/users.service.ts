import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'src/shared/constants';
import { ERole } from 'src/shared/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createOne(createUserDto: CreateUserDto) {
    const { username, password: plainPass, role } = createUserDto;

    const password = await bcrypt.hash(plainPass, saltOrRounds);

    return this.usersRepository.save({
      username,
      password,
      role,
    });
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async getEditors() {
    return this.usersRepository.findBy({ role: ERole.Editor });
  }

  async check(userId: number) {
    const { password, ...others } = await this.usersRepository.findOneBy({
      id: userId,
    });

    return others;
  }
}

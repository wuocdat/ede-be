import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.createOne(createUserDto);

    return result;
  }
}

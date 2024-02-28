import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorator/roles.decorator';
import { ERole } from 'src/shared/enums/roles.enum';

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Roles(ERole.Admin)
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.createOne(createUserDto);

    return result;
  }
}

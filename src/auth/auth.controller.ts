import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './auth.decorator';
import { Roles } from 'src/shared/decorator/roles.decorator';
import { ERole } from 'src/shared/enums/roles.enum';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SignDto } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: SignDto })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Roles(ERole.Editor)
  @Get('test')
  getProfile(@Request() req) {
    return req.user;
  }
}

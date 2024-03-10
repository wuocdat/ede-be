import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ERole } from 'src/shared/enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({ default: 'wuocdat' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ default: '1' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ default: ERole.Admin })
  @IsEnum(ERole)
  @IsOptional()
  role?: ERole;
}

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: ERole;
}

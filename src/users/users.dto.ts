import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ERole } from 'src/shared/enums/roles.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(ERole, { each: true })
  roles: ERole[];
}

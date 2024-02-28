import { ApiProperty } from '@nestjs/swagger';

export class SignDto {
  @ApiProperty({
    default: 'john',
  })
  username: string;

  @ApiProperty({
    default: 'changeme',
  })
  password: string;
}

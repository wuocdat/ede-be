import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTranslationDto {
  @ApiProperty({
    default: `Sa hlăm dŭm mta diŏ tuôm hlăm klei hdĭp aguah tlam anak mnuih drei anăn lah êa jua leh anăn wăl riêng gah.`,
  })
  @IsString()
  @IsNotEmpty()
  ede_text: string;

  @ApiProperty({
    default: `Một trong những yếu tố có ảnh hưởng trực tiếp đến cuộc sống của chúng ta đó là nước và môi trường sống.`,
  })
  @IsString()
  @IsNotEmpty()
  vi_text: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  correct_ede_text?: string | null;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  correct?: boolean;
}

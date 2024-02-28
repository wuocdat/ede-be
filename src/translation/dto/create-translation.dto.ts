import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTranslationDto {
  @ApiProperty({
    default: `Anăn lah mđiă yang hruê, čư̆ čhiăng, hnoh êa, êa ksĭ, angĭn, hlô mnơ̆ng, ana kyâo, rơ̆k tơ̆k, lăn, êa,…
  `,
  })
  @IsString()
  @IsNotEmpty()
  ede_text: string;

  @ApiProperty({
    default: `Đó là ánh sáng mặt trời, núi sông, biển cả, không khí, động vật, thực vật, đất, nước,... 
  `,
  })
  @IsString()
  @IsOptional()
  vi_text?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  correct?: boolean;
}

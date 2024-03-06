import { ApiProperty } from '@nestjs/swagger';

export class TranslationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ede_text: string;

  @ApiProperty()
  vi_text: string;

  @ApiProperty()
  correct_ede_text: string | null;

  @ApiProperty()
  correct: boolean;

  @ApiProperty()
  createdBy: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedBy: number;

  @ApiProperty()
  updatedAt: Date;
}

export class AmountStatisticDto {
  @ApiProperty()
  incorrectTransNum: number;

  @ApiProperty()
  correctTransNum: number;

  @ApiProperty()
  allTransNum: number;
}

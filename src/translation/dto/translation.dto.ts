import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserDto } from 'src/users/users.dto';

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

export class EditorStatisticDto {
  @ApiProperty()
  editor: UserDto;

  @ApiProperty()
  editedSentenceCount: number;
}

export class StatisticByMonthDto {
  @ApiProperty({ default: '2024-03-09', nullable: true })
  @IsDateString()
  @IsOptional()
  date?: string;
}

export class FindTransOptionDto {
  @ApiProperty({ default: '2024-01-09' })
  @IsDateString()
  @IsNotEmpty()
  start: string;

  @ApiProperty({ default: '2024-03-09' })
  @IsDateString()
  @IsNotEmpty()
  end: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  text?: string;
}

export class ParseMultipleExcelFileResDto {
  @ApiProperty()
  savedTransNum: number;

  @ApiProperty()
  filesNameList: string[];

}
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { TranslationService } from './translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { Request } from 'src/shared/types/request-with-user';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorator/roles.decorator';
import { ERole } from 'src/shared/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { PageDto, PageOptionsDto } from 'src/shared/dto/page.dto';
import {
  AmountStatisticDto,
  EditorStatisticDto,
  StatisticByMonthDto,
  TranslationDto,
} from './dto/translation.dto';

@ApiTags('Translation')
@ApiBearerAuth()
@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Roles(ERole.Admin)
  @Post()
  create(
    @Body() createTranslationDto: CreateTranslationDto,
    @Req() req: Request,
  ) {
    return this.translationService.create(createTranslationDto, req.user.id);
  }

  @ApiBody({
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @Roles(ERole.Admin)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async parseFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.translationService.parseExcelFile(file, req.user.id);
  }

  @Roles(ERole.Admin)
  @Post('/many-trans')
  @ApiBody({ type: [CreateTranslationDto] })
  async createMultipleTrans(
    @Body() transDto: CreateTranslationDto[],
    @Req() req: Request,
  ) {
    return await this.translationService.createMultipleTrans(
      transDto,
      req.user.id,
    );
  }

  @Get('/incorrect-trans')
  async findIncorrectTrans() {
    return await this.translationService.findIncorrectTrans();
  }

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TranslationDto>> {
    return await this.translationService.findAll(pageOptionsDto);
  }

  @Get('/all-correct-trans')
  async findAllCorrectTrans(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TranslationDto>> {
    return await this.translationService.findAllCorrectTrans(pageOptionsDto);
  }

  @Get('/count-all')
  async countAll(): Promise<number> {
    return await this.translationService.countAll();
  }

  @Get('/amount-statistic')
  async getAmountStatistic(): Promise<AmountStatisticDto> {
    return this.translationService.getAmountStatistic();
  }

  @Get('/monthly-editor-statistic')
  async getMonthlyEditorStatistic(
    @Query() statisticByMonthDto: StatisticByMonthDto,
  ): Promise<EditorStatisticDto[]> {
    return this.translationService.getMonthlyEditorResults(statisticByMonthDto);
  }

  @Get('/all-time-editor-statistic')
  async getAllTimeEditorStatistic(): Promise<EditorStatisticDto[]> {
    return this.translationService.getAllTimeEditorResults();
  }

  @Get('/monthly-correct-statistic')
  async getMonthlyCorrectTransStatistic(
    @Query() statisticByMonthDto: StatisticByMonthDto,
  ) {
    return this.translationService.getMonthlyCorrectTransCount(
      statisticByMonthDto,
    );
  }

  @Get('/yearly-correct-statistic')
  async getYearlyCorrectTransStatistic() {
    return this.translationService.getYearlyCorrectTransCount();
  }

  @Get('/recent-updated-trans')
  async getRecentUpdatedTrans(@Req() req: Request) {
    return this.translationService.getRecentUpdatedTrans(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.translationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTranslationDto: UpdateTranslationDto,
    @Req() req: Request,
  ) {
    return this.translationService.update(
      +id,
      updateTranslationDto,
      req.user.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.translationService.remove(+id);
  }
}

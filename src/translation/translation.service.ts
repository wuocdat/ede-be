import * as Excel from 'exceljs';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as moment from 'moment';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { Repository } from 'typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/shared/dto/page.dto';
import {
  AmountStatisticDto,
  EditorStatisticDto,
  StatisticByMonthDto,
  TranslationDto,
} from './dto/translation.dto';
import { UsersService } from 'src/users/users.service';
import { Order } from 'src/shared/enums/order.enum';

type TransRowType = {
  ede_text: string;
  vi_text: string;
  correct_ede_text: string | null;
  correct?: boolean;
};

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(Translation)
    private transRepository: Repository<Translation>,
    private readonly userService: UsersService,
  ) {}

  private readonly logger = new Logger(TranslationService.name);

  async create(createTranslationDto: CreateTranslationDto, userId: number) {
    const existedRecord = await this.transRepository.findOneBy({
      ede_text: createTranslationDto.ede_text,
    });

    if (existedRecord) {
      throw new ConflictException('Bản dịch đã tồn tại.');
    }

    return this.transRepository.save({
      ...createTranslationDto,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async createMultipleTrans(transDto: CreateTranslationDto[], userId: number) {
    let savedTransCounter = 0;

    for (let i = 0; i < transDto.length; i++) {
      try {
        await this.create(transDto[i], userId);
        savedTransCounter++;
      } catch (error) {
        this.logger.log(error.message + `: ${transDto[i].ede_text}`);
      }
    }

    return {
      savedTransNum: savedTransCounter,
    };
  }

  async parseExcelFile(file: Express.Multer.File, userId: number) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.worksheets[0];
    const parseTransList: TransRowType[] = [];
    worksheet.eachRow(function (row, rowNumber) {
      if (rowNumber > 1) {
        parseTransList.push({
          ede_text: row.getCell(1).value?.toString() || '',
          vi_text: row.getCell(2).value?.toString() || '',
          correct_ede_text: row.getCell(3).value?.toString() || null,
          correct:
            !!row.getCell(1).value &&
            !!row.getCell(2).value &&
            !!row.getCell(3).value,
        });
      }
    });

    if (parseTransList.length === 0)
      throw new BadRequestException('File không đúng định dạng hoặc rỗng.');

    return await this.createMultipleTrans(parseTransList, userId);
  }

  async findIncorrectTrans() {
    const result = await this.transRepository.findOneBy({ correct: false });

    return {
      trans: result,
    };
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TranslationDto>> {
    const queryBuilder = this.transRepository.createQueryBuilder('translation');

    queryBuilder
      .orderBy('translation.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllCorrectTrans(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TranslationDto>> {
    const queryBuilder = this.transRepository.createQueryBuilder('translation');

    queryBuilder
      .where('translation.correct=true')
      .orderBy('translation.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(entities, pageMetaDto);
  }

  async countAll(): Promise<number> {
    return await this.transRepository.count();
  }

  async getAmountStatistic(): Promise<AmountStatisticDto> {
    const allTransNum = await this.transRepository.count();
    const correctTransNum = await this.transRepository.countBy({
      correct: true,
    });
    const incorrectTransNum = await this.transRepository.countBy({
      correct: false,
    });

    return {
      incorrectTransNum,
      correctTransNum,
      allTransNum,
    };
  }

  async getMonthlyEditorResults(
    dto: StatisticByMonthDto,
  ): Promise<EditorStatisticDto[]> {
    const editors = await this.userService.getEditors();

    const result: EditorStatisticDto[] = [];

    for (let i = 0; i < editors.length; i++) {
      const currentEditor = editors[i];
      const updatedAmount = await this.transRepository
        .createQueryBuilder('translation')
        .where('translation.updatedByUser =:editorId', {
          editorId: editors[i].id,
        })
        .andWhere('translation.correct=true')
        .andWhere('translation.updatedAt >= :after', {
          after: moment(dto.date || undefined)
            .startOf('month')
            .format('YYYY-MM-DD'),
        })
        .andWhere('translation.updatedAt < :before', {
          before: moment(dto.date || undefined)
            .endOf('month')
            .add(1, 'days')
            .format('YYYY-MM-DD'),
        })
        .getCount();

      result.push({
        editor: {
          id: currentEditor.id,
          username: currentEditor.username,
          role: currentEditor.role,
        },
        editedSentenceCount: updatedAmount,
      });
    }

    return result;
  }

  async getAllTimeEditorResults(): Promise<EditorStatisticDto[]> {
    const editors = await this.userService.getEditors();

    const result: EditorStatisticDto[] = [];

    for (let i = 0; i < editors.length; i++) {
      const currentEditor = editors[i];
      const updatedAmount = await this.transRepository
        .createQueryBuilder('translation')
        .where('translation.updatedByUser =:editorId', {
          editorId: editors[i].id,
        })
        .andWhere('translation.correct=true')
        .getCount();

      result.push({
        editor: {
          id: currentEditor.id,
          username: currentEditor.username,
          role: currentEditor.role,
        },
        editedSentenceCount: updatedAmount,
      });
    }

    return result;
  }

  async getMonthlyCorrectTransCount(dto: StatisticByMonthDto) {
    const editorResults = await this.getMonthlyEditorResults(dto);

    const monthlyCount = editorResults.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.editedSentenceCount,
      0,
    );

    return {
      editors: editorResults,
      total: monthlyCount,
    };
  }

  async getYearlyCorrectTransCount() {
    const result: any[] = [];
    for (let i = 0; i < 12; i++) {
      const currentMonthStatistic = await this.getMonthlyCorrectTransCount({
        date: moment().startOf('year').add(i, 'months').format('YYYY-MM-DD'),
      });

      const editorNames = currentMonthStatistic.editors.map((editor) => ({
        [editor.editor.username]: editor.editedSentenceCount,
      }));

      const currentMonthData = editorNames.reduce(
        (accumulator, currentValue) => ({ ...accumulator, ...currentValue }),
        {},
      );

      currentMonthData.total = currentMonthStatistic.total;

      result.push({
        ...currentMonthData,
        month: moment().startOf('year').add(i, 'months').format('MMM'),
      });
    }

    return result;
  }

  async getRecentUpdatedTrans(editorId: number) {
    const result = await this.transRepository.find({
      where: {
        updatedBy: editorId,
      },
      order: {
        updatedAt: Order.DESC,
      },
      take: 5,
    });

    return result;
  }

  findOne(id: number) {
    return this.transRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateTranslationDto: UpdateTranslationDto,
    userId: number,
  ) {
    await this.transRepository.update(id, {
      ...updateTranslationDto,
      updatedBy: userId,
    });

    return {
      message: 'updated successfully',
    };
  }

  remove(id: number) {
    return `This action removes a #${id} translation`;
  }
}

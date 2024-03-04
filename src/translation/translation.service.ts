import * as Excel from 'exceljs';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { Repository } from 'typeorm';

type TransRowType = {
  ede_text: string;
  vi_text: string;
};

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(Translation)
    private transRepository: Repository<Translation>,
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

  async parseExcelFile(file: Express.Multer.File) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.worksheets[0];
    const parseTransList: TransRowType[] = [];
    worksheet.eachRow(function (row, rowNumber) {
      if (rowNumber > 2 && row.cellCount >= 3) {
        parseTransList.push({
          ede_text: row.getCell(2).value.toString(),
          vi_text: row.getCell(3).value.toString(),
        });
      }
    });

    if (parseTransList.length === 0)
      throw new BadRequestException('File không đúng định dạng hoặc rỗng.');

    return parseTransList;
  }

  async findIncorrectTrans() {
    const result = await this.transRepository.findOneBy({ correct: false });

    return {
      trans: result,
    };
  }

  findAll() {
    return `This action returns all translation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} translation`;
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

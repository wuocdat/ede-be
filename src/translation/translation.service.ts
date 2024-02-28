import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(Translation)
    private transRepository: Repository<Translation>,
  ) {}

  async create(createTranslationDto: CreateTranslationDto, userId: number) {
    const existedRecord = await this.transRepository.findOneBy({
      ede_text: createTranslationDto.ede_text,
    });

    if (existedRecord) {
      throw new ConflictException('Bản dịch đã tồn tại.');
    }

    return this.transRepository.save({
      ...createTranslationDto,
      createdAt: '',
      createdBy: userId,
      updatedAt: '',
      updatedBy: userId,
    });
  }

  findAll() {
    return `This action returns all translation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} translation`;
  }

  update(id: number, updateTranslationDto: UpdateTranslationDto) {
    console.log(updateTranslationDto);

    return `This action updates a #${id} translation`;
  }

  remove(id: number) {
    return `This action removes a #${id} translation`;
  }
}

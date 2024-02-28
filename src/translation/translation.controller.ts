import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TranslationService } from './translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { Request } from 'src/shared/types/request-with-user';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorator/roles.decorator';
import { ERole } from 'src/shared/enums/roles.enum';

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

  @Get()
  findAll() {
    return this.translationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.translationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTranslationDto: UpdateTranslationDto,
  ) {
    return this.translationService.update(+id, updateTranslationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.translationService.remove(+id);
  }
}

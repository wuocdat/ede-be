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
} from '@nestjs/common';
import { TranslationService } from './translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { Request } from 'src/shared/types/request-with-user';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorator/roles.decorator';
import { ERole } from 'src/shared/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';

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
  ) {
    return await this.translationService.parseExcelFile(file);
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

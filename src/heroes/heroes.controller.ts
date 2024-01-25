import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('heroes')
@Controller('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: [CreateHeroDto] })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Sorry, but that hero name is been used already!',
  })
  create(@Body() createHeroDto: CreateHeroDto) {
    return this.heroesService.create(createHeroDto);
  }

  @Get()
  @ApiOkResponse({
    description: '',
  })
  findAll() {
    return this.heroesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.heroesService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: [UpdateHeroDto] })
  update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
    return this.heroesService.update(+id, updateHeroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.heroesService.remove(+id);
  }
}

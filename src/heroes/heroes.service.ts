import { Injectable } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HeroesService {
  constructor(
    @InjectRepository(Hero)
    private heroRepository: Repository<Hero>,
  ) {}
  create(createHeroDto: CreateHeroDto) {
    return this.heroRepository.save(createHeroDto);
  }

  findAll() {
    return this.heroRepository.find();
  }

  findOne(id: number) {
    return this.heroRepository.findOneBy({ id: id });
  }

  update(id: number, updateHeroDto: UpdateHeroDto) {
    return this.heroRepository.update(id, updateHeroDto);
  }

  remove(id: number) {
    return this.heroRepository.delete(id);
  }
}

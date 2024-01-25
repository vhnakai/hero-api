import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { In, Not, Repository } from 'typeorm';

@Injectable()
export class HeroesService {
  constructor(
    @InjectRepository(Hero)
    private heroRepository: Repository<Hero>,
  ) {}

  async create(createHeroDto: CreateHeroDto) {
    const UniqueHeroNameHandler = await this.heroRepository.find({
      where: { heroName: createHeroDto.heroName },
    });

    if (UniqueHeroNameHandler.length > 0) {
      throw new HttpException(
        'Sorry, but that hero name is been used already!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newHero = this.heroRepository.create(createHeroDto);
    return this.heroRepository.save(newHero);
  }

  async findAll() {
    const heroes = await this.heroRepository.find();

    if (heroes.length === 0) {
      throw new HttpException(
        'Any one can be a hero, please register one, because we dont have any heroes on our database',
        HttpStatus.OK,
      );
    }
    return heroes;
  }

  async findOne(id: number) {
    const hero = await this.heroRepository.findOneBy({ id: id });

    if (!hero) {
      throw new HttpException('id was not found', HttpStatus.NOT_FOUND);
    }
    return hero;
  }

  async update(id: number, updateHeroDto: UpdateHeroDto) {
    //verify if heroname is valid

    const UniqueHeroNameHandler = await this.heroRepository.find({
      where: { heroName: updateHeroDto.heroName, id: Not(id) },
    });

    if (UniqueHeroNameHandler.length > 0) {
      throw new HttpException(
        'Sorry, but that hero name is been used already!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.heroRepository.update(id, updateHeroDto);
  }

  remove(id: number) {
    return this.heroRepository.delete(id);
  }

  async createMany(heroes: CreateHeroDto[]) {
    //validate all hero name is unique and hasnt used yet
    const heroesNames = heroes.map((hero) => hero.heroName);

    const findSomeEqualHeroName = heroesNames.some(
      (e, i, arr) => arr.indexOf(e) !== i,
    );

    if (findSomeEqualHeroName) {
      throw new HttpException(
        'Sorry, but in this list, some heros name is repeated!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const UniqueHeroNameHandler = await this.heroRepository.findBy({
      heroName: In(heroesNames),
    });

    if (UniqueHeroNameHandler.length > 0) {
      throw new HttpException(
        'Sorry, but in this list, some heros name has been used already!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const heroesEntities = heroes.map((hero) => {
      return this.heroRepository.create(hero);
    });

    return this.heroRepository.save(heroesEntities);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { HeroesService } from './heroes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { Repository } from 'typeorm';

describe('HeroesService', () => {
  let service: HeroesService;
  let heroRepository: Repository<Hero>;

  const token = getRepositoryToken(Hero);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeroesService,
        {
          provide: token,
          useValue: { create: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<HeroesService>(HeroesService);
    heroRepository = module.get<Repository<Hero>>(token);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(heroRepository).toBeDefined();
  });

  it('HeroRepository should be defined', () => {
    expect(heroRepository).toBeDefined();
  });

  describe('createHero', () => {
    it('should create new hero', async () => {
      const payload = {
        name: 'ALL MIGHT',
        power: 'Strong punch line',
      };

      await service.create(payload);

      expect(heroRepository.create).toHaveBeenCalledWith(payload);
    });

    it('should save new hero ', async () => {
      const payload = {
        name: 'ALL MIGHT',
        power: 'Strong punch line',
      };

      jest.spyOn(heroRepository, 'create').mockReturnValueOnce({
        ...payload,
        id: 1,
      });

      await service.create(payload);

      expect(heroRepository.save).toHaveBeenCalledWith({
        ...payload,
        id: 1,
      });
    });
  });
});

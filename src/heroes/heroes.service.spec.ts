import { Test, TestingModule } from '@nestjs/testing';
import { HeroesService } from './heroes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { Repository } from 'typeorm';

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

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
          useValue: {
            create: jest.fn((entity) => entity),
            save: jest.fn((entity) => entity),
            find: jest.fn((entity) => entity),
            findBy: jest.fn((entity) => entity),
          },
        },
      ],
    })
      .useMocker((token) => {
        const results = ['test1', 'test2'];
        if (token === HeroesService) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<HeroesService>(HeroesService);
    heroRepository = module.get<Repository<Hero>>(token);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('HeroRepository should be defined', () => {
    expect(heroRepository).toBeDefined();
  });

  describe('createHero', () => {
    it('should create new hero', async () => {
      const payload = {
        name: 'Utena',
        heroName: 'MagiaBaiser',
        birthDate: new Date('1997-12-01T02:00:00.000Z'),
        heigth: 160,
        weigh: 56,
      };

      await service.create(payload);

      expect(heroRepository.create).toHaveBeenCalledWith(payload);
    });

    it('should save new hero ', async () => {
      const payload = {
        name: 'Utena',
        heroName: 'MagiaBaiser',
        birthDate: new Date('1997-12-01T02:00:00.000Z'),
        heigth: 160,
        weigh: 56,
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

    // it('should throw a error to save new hero with used hero name', async () => {
    //   const payload = {
    //     name: 'Utena',
    //     heroName: 'MagiaBaiser',
    //     birthDate: new Date('1997-12-01T02:00:00.000Z'),
    //     heigth: 160,
    //     weigh: 56,
    //   };

    //   jest.spyOn(heroRepository, 'create').mockReturnValueOnce({
    //     ...payload,
    //     id: 1,
    //   });

    //   await service.create(payload);
    //   await service.create(payload);

    //   expect(heroRepository.create).toHaveReturnedWith({
    //     message: 'Sorry, but that hero name is been used already!',
    //   });
    // });
  });

  describe('createMany', () => {
    it('should create at least 3 hero', async () => {
      const payload = [
        {
          name: 'Utena',
          heroName: 'MagiaBaiser',
          birthDate: new Date('1997-12-01T02:00:00.000Z'),
          heigth: 160,
          weigh: 56,
        },
        {
          name: 'Kiwi',
          heroName: 'MagiaLeo',
          birthDate: new Date('1997-10-06T02:00:00.000Z'),
          heigth: 154,
          weigh: 40,
        },
        {
          name: 'Utena',
          heroName: 'MagiaB',
          birthDate: new Date('1997-12-01T02:00:00.000Z'),
          heigth: 160,
          weigh: 56,
        },
      ];

      await service.createMany(payload);

      jest.spyOn(heroRepository, 'create').mockReturnValueOnce({
        ...payload[0],
        id: 1,
      });

      jest.spyOn(heroRepository, 'create').mockReturnValueOnce({
        ...payload[1],
        id: 2,
      });

      jest.spyOn(heroRepository, 'create').mockReturnValueOnce({
        ...payload[3],
        id: 2,
      });

      expect(heroRepository.save).toHaveBeenCalledWith(payload);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HeroesService } from './heroes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { DataSource, Repository } from 'typeorm';

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('HeroesService', () => {
  let service: HeroesService;
  let heroRepository: Repository<Hero>;
  let datasource: DataSource;

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
    datasource = module.get<DataSource>(token);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('HeroRepository should be defined', () => {
    expect(heroRepository).toBeDefined();
  });

  it('datasource should be defined', () => {
    expect(datasource).toBeDefined();
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

  // describe('createMany', () => {
  //   it('should create at least 3 hero', async () => {
  //     const payload = [
  //       {
  //         name: 'ALL MIGHT',
  //         power: 'Strong punch line',
  //       },
  //       {
  //         name: 'ALL MIGHT 2',
  //         power: 'Strong kick',
  //       },
  //       {
  //         name: 'ALL MIGHT 3',
  //         power: 'Strong punch ',
  //       },
  //     ];

  //     await service.createMany(payload);

  //     expect(datasource.transaction).toHaveBeenCalledWith(payload);
  //   });
  // });
});

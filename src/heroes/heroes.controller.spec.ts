import { Test, TestingModule } from '@nestjs/testing';
import { HeroesController } from './heroes.controller';
import { HeroesService } from './heroes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { Repository } from 'typeorm';

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('HeroesController', () => {
  let controller: HeroesController;
  let service: HeroesService;
  let heroRepository: Repository<Hero>;

  const token = getRepositoryToken(Hero);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeroesController],
      providers: [
        HeroesService,
        {
          provide: token,
          useValue: { create: jest.fn() },
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

    controller = module.get<HeroesController>(HeroesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('HeroRepository should be defined', () => {
    expect(heroRepository).toBeDefined();
  });
});

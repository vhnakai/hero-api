import { Test, TestingModule } from '@nestjs/testing';
import { HeroesController } from './heroes.controller';
import { HeroesService } from './heroes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { Repository } from 'typeorm';

const mokedHeroesList: Hero[] = [
  {
    id: 1,
    name: 'Utena',
    heroName: 'MagiaBaiser',
    birthDate: new Date('1997-12-01T02:00:00.000Z'),
    heigth: 160,
    weigh: 56,
  },
  {
    id: 2,
    name: 'Kiwi',
    heroName: 'MagiaLeo',
    birthDate: new Date('1997-10-06T02:00:00.000Z'),
    heigth: 154,
    weigh: 40,
  },
];

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
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockResolvedValue(mokedHeroesList),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

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

  describe('findall', () => {
    it('Should return a hero list entity successfully', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mokedHeroesList);
    });

    it('Should return a message of none hero', () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error());
      expect(controller.findAll()).rejects.toThrow();
    });
  });
});

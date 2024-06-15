import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';

// Mock repository
const mockLocationRepository = {
  find: jest.fn().mockResolvedValue([
    { id: 1, name: 'Location 1' },
    { id: 2, name: 'Location 2' },
  ]),
};

describe('LocationService', () => {
  let service: LocationService;
  let repository: Repository<Location>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    repository = module.get<Repository<Location>>(getRepositoryToken(Location));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const result = await service.findAll();
      expect(result).toEqual([
        { id: 1, name: 'Location 1' },
        { id: 2, name: 'Location 2' },
      ]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });
});

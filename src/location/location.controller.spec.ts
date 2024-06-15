import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

// Mock service
const mockLocationService = {
  findAll: jest.fn().mockResolvedValue([
    { id: 1, name: 'Location 1' },
    { id: 2, name: 'Location 2' },
  ]),
};

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([
        { id: 1, name: 'Location 1' },
        { id: 2, name: 'Location 2' },
      ]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });
});

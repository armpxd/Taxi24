import { Test, TestingModule } from '@nestjs/testing';
import { RideService } from './ride.service';
import { GetRideDto } from './dto/getRide.dto';
import { CreateRideDto } from './dto/createRide.dto';
import { NotFoundException } from '@nestjs/common';
import { RideController } from './ride.controller';

const ridesDto: GetRideDto[] = [{
  id: 1,
  passengerId: 1,
  driverId: 1,
  startLocationId: 1,
  endLocationId: 1,
  status: 'active'
},
{
  id: 1,
  passengerId: 1,
  driverId: 1,
  startLocationId: 1,
  endLocationId: 1,
  status: 'finished'
}]

class RidesServiceMock {
  create(createRideDto: CreateRideDto) {
    return { id: 1, ...createRideDto };
  }

  findAll() {
    return ridesDto;
  }

  findAllActive() {
    return [ridesDto[0]];
  }

  completeRide(id: number) {
    return { id, status: 'completed' };
  }

  findOneById(id: number) {
    if (id !== 1) {
      throw new NotFoundException(`No ride was found with the ${id}}`)
    }
    return ridesDto[0];
  }
}

describe('RidesController', () => {
  let controller: RideController;
  let service: RideService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [
        {
          provide: RideService,
          useClass: RidesServiceMock, 
        },
      ],
    }).compile();

    controller = module.get<RideController>(RideController);
    service = module.get<RideService>(RideService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createRideDto: CreateRideDto = {
      passengerId: 1,
      driverId: 1,
      startLatitude: 50,
      startLongitude: 50,
      endLongitude: 50,
      endLatitude: -50,
    };

    it('should create a ride', () => {
      const result = controller.create(createRideDto);
      expect(result).toEqual({ id: 1, ...createRideDto });
    });
  });

  describe('findAll', () => {
    it('should return an array of rides', () => {
      const result = controller.findAll();
      expect(result).toEqual(ridesDto);
    });
  });

  describe('findAllActive', () => {
    it('should return an array of active rides', () => {
      const result = controller.findAllActive();
      expect(result).toEqual([ridesDto[0]]);
    });
  });

  describe('completeRide', () => {
    it('should complete a ride by ID', () => {
      const result = controller.completeRide('1');
      expect(result).toEqual({ id: 1, status: 'completed' });
    });
  });

  describe('findOneById', () => {
    it('should return a ride by ID', () => {
      const result = controller.findOneById('1');
      expect(result).toEqual(ridesDto[0]);
    });

    it('should throw NotFoundException if ride not found', () => {
      expect(() => controller.findOneById('99')).toThrow(NotFoundException);
    });
  });
});
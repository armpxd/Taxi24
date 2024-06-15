import { NotFoundException } from '@nestjs/common';
import { CreateDriverDto } from './dto/createDriver.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

const drivers = [
  { id: 1, name: 'Driver1', email: 'driver1@gmail.com', available: true },
  { id: 2, name: 'Driver2', email: 'driver2@gmail.com', available: false },
];

class DriversServiceMock {
  create(createDriverDto: CreateDriverDto) {
    return { id: 1, ...createDriverDto };
  }

  findAll() {
    return drivers;
  }

  findAllAvailable() {
    return drivers.filter((driver) => driver.available === true);
  }

  findAllAvailableWithinRadius(latitude: string, longitude: string) {
    return [drivers[1]];
  }

  find3AvailableDrivers(latitude: string, longitude: string) {
    return [drivers[0]];
  }

  findById(id: number) {
    if (id !== 1) {
      throw new NotFoundException('No driver was found with this ID');
    }
    return drivers[0];
  }
}

describe('DriversController', () => {
  let controller: DriverController;
  let service: DriverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [
        {
          provide: DriverService,
          useClass: DriversServiceMock,
        },
      ],
    }).compile();

    controller = module.get<DriverController>(DriverController);
    service = module.get<DriverService>(DriverService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});

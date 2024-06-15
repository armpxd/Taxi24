import { Test, TestingModule } from '@nestjs/testing';
import { DriverService } from './driver.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '../person/entities/person.entity';
import { EntityManager } from 'typeorm';

import { Driver } from './entities/driver.entity';
import { Location } from '../location/entities/location.entity';
import { GetDriverDto } from './dto/getDriver.dto';
import { CreateDriverDto } from './dto/createDriver.dto';
import { EntityManagerMock, RepositoryMock } from '../helpers/testUtils';

const driversResultDTO: GetDriverDto[] = [
  {
    id: 1,
    name: 'Driver1',
    email: 'driver1@gmail.com',
    latitude: 40.7128,
    longitude: -74.006,
    available: true,
    lastName: 'sadge',
    phoneNumber: '+1 809 386 0005',
  },
];

const driversData: Driver[] = [
  {
    id: 1,
    person: {
      id: 1,
      name: 'Driver1',
      email: 'driver1@gmail.com',
      lastName: 'sadge',
      phoneNumber: '+1 809 386 0005',
    },
    location: { id: 1, latitude: 40.7128, longitude: -74.006 },
    available: true,
  },
];

describe('DriversService', () => {
  let service: DriverService;
  let driverRepository: RepositoryMock<Driver>;
  let personRepository: RepositoryMock<Person>;
  let locationRepository: RepositoryMock<Location>;
  let entityManager: EntityManagerMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: getRepositoryToken(Driver),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Person),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Location),
          useClass: RepositoryMock,
        },
        {
          provide: EntityManager,
          useClass: EntityManagerMock,
        },
      ],
    }).compile();

    service = module.get<DriverService>(DriverService);
    driverRepository = module.get<RepositoryMock<Driver>>(
      getRepositoryToken(Driver),
    );
    personRepository = module.get<RepositoryMock<Person>>(
      getRepositoryToken(Person),
    );
    locationRepository = module.get<RepositoryMock<Location>>(
      getRepositoryToken(Location),
    );
    entityManager = module.get<EntityManagerMock>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDriverDto: CreateDriverDto = driversResultDTO[0];

    it('should create a driver', async () => {
      const result = await service.createDriver(createDriverDto);
      const expectedResult: GetDriverDto = driversResultDTO[0];
      expect(result).toEqual(expectedResult);
    });

    it('should throw InternalServerErrorException if an error occurs during creation', async () => {
      jest
        .spyOn(entityManager, 'save')
        .mockRejectedValue(new Error('Some error'));
      await expect(service.createDriver(createDriverDto)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of drivers', async () => {
      driverRepository.data = driversData;

      const result = await service.findAll();
      const expectedResult: GetDriverDto[] = driversResultDTO;
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllAvailable', () => {
    it('should return an array of available drivers', async () => {
      driverRepository.data = driversData;

      const result = await service.findAllAvailable();
      const expectedResult: GetDriverDto[] = driversResultDTO;

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllAvailableIn3km', () => {
    it('should return an array of available drivers within 3km', async () => {
      driverRepository.data = driversData;

      const result = await service.findAllAvailableWithinRadius(
        40.7128,
        -74.006,
      );
      const expectedResult: GetDriverDto[] = driversResultDTO;

      expect(result).toEqual(expectedResult);
    });
  });

  describe('find3NearestDrivers', () => {
    it('should return an array of the 3 nearest drivers', async () => {
      driverRepository.data = driversData;

      const result = await service.findNearbyDrivers(40.7128, -74.006);
      const expectedResult: GetDriverDto[] = driversResultDTO;

      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if no drivers are found', async () => {
      driverRepository.data = [];

      await expect(
        service.findNearbyDrivers(40.7128, -74.006),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});

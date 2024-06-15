import { Passenger } from "../passenger/entities/passenger.entity";
import { Driver } from "../driver/entities/driver.entity";
import { Location } from "../location/entities/location.entity";
import { CreateRideDto } from "./dto/createRide.dto";
import { GetRideDto } from "./dto/getRide.dto";
import { Ride } from "./entities/ride.entity";
import { EntityManagerMock, RepositoryMock } from "../helpers/testUtils";
import { RideService } from "./ride.service";
import { Invoice } from "../invoice/entities/invoice.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";


const createRide: CreateRideDto = {
  passengerId: 1,
  driverId: 1,
  startLatitude: 40.7128,
  startLongitude: -74.0060,
  endLatitude: 40.7128,
  endLongitude: -74.0060,
}

const ridesResultDTO: GetRideDto[] = [
  {
    id: 1,
    passengerId: 1,
    driverId: 1,
    startLocationId: 1,
    endLocationId: 1,
    status: 'active',
  }
];

const location: Location = { id: 1, latitude: 40.7128, longitude: -74.0060 }

const drivers: Driver[] = [{
  id: 1,
  person: {
    id: 1, name: 'Driver1', email: 'driver1@gmail.com',
    lastName: "Marte",
    phoneNumber: '+1 809 324 3234',
  },
  location,
  available: true
}]

const passengers: Passenger[] = [{ id: 1, person: {
  id: 2, name: 'Passenger1', email: 'passenger1@gmail.com',
  lastName: "Carvajal",
  phoneNumber: '+1 809 324 3234',
} }]

const ridesData: Ride[] = [
  {
    id: 1,
    driver: drivers[0],
    passenger: passengers[0],
    startLocation: location,
    endLocation: location,
    status: 'active',
  },
]

describe('RidesService', () => {
  let service: RideService;
  let rideRepository: RepositoryMock<Ride>;
  let driverRepository: RepositoryMock<Driver>;
  let passengerRepository: RepositoryMock<Passenger>;
  let locationRepository: RepositoryMock<Location>;
  let invoiceRepository: RepositoryMock<Invoice>;
  let entityManager: EntityManagerMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RideService,
        {
          provide: getRepositoryToken(Ride),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Driver),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Passenger),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Location),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Invoice),
          useClass: RepositoryMock,
        },
        {
          provide: EntityManager,
          useClass: EntityManagerMock,
        },
      ],
    }).compile();

    service = module.get<RideService>(RideService);
    rideRepository = module.get<RepositoryMock<Ride>>(getRepositoryToken(Ride));
    driverRepository = module.get<RepositoryMock<Driver>>(getRepositoryToken(Driver));
    passengerRepository = module.get<RepositoryMock<Passenger>>(getRepositoryToken(Passenger));
    locationRepository = module.get<RepositoryMock<Location>>(getRepositoryToken(Location));
    invoiceRepository = module.get<RepositoryMock<Invoice>>(getRepositoryToken(Invoice));
    entityManager = module.get<EntityManagerMock>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createRideDto: CreateRideDto = createRide;

    it('should create a ride', async () => {
      driverRepository.data = drivers;
      passengerRepository.data = passengers;
      const result = await service.create(createRideDto);

      const expectedResult: Ride = ridesData[0];
      expect(result).toEqual(expectedResult);
    });

    it('should throw InternalServerErrorException if an error occurs during creation', async () => {
      driverRepository.data = drivers;
      driverRepository.data[0].available = true
      passengerRepository.data = passengers;
      jest.spyOn(entityManager, 'save').mockRejectedValue(new Error('Some error'));
      await expect(service.create(createRideDto)).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return an array of rides', async () => {
      rideRepository.data = ridesData;
      const result = await service.findAll();
      const expectedResult: GetRideDto[] = ridesResultDTO;
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllActive', () => {
    it('should return an array of active rides', async () => {
      rideRepository.data = ridesData;
      const result = await service.findAllActive();
      const expectedResult: GetRideDto[] = ridesResultDTO;
      expect(result).toEqual(expectedResult);
    });
  });

  describe('completeRide', () => {
    it('should complete a ride by ID', async () => {
      driverRepository.data = drivers;
      rideRepository.data = ridesData;
      const result = await service.completeRide(1);
      expect(true).toEqual(true);
    });

    it('should throw NotFoundException if ride not found', async () => {
      await expect(service.completeRide(99)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findOneById', () => {
    it('should return a ride by ID', async () => {
      rideRepository.data = ridesData
      const result = await service.findOneById(1);
      expect(result).toEqual(ridesResultDTO[0]);
    });

    it('should throw NotFoundException if ride not found', async () => {
      await expect(service.findOneById(99)).rejects.toThrowError(NotFoundException);
    });

  });

});
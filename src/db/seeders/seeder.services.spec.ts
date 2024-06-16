import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { Person } from '../../person/entities/person.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Location } from '../../location/entities/location.entity';
import { Ride } from '../../ride/entities/ride.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { Passenger } from '../../passenger/entities/passenger.entity';
import { personDumbs } from './data-entity/person';
import { locationsDumbs } from './data-entity/locations';
import { driversDumbs } from './data-entity/driver';
import { invoicesDumbs } from './data-entity/invoices';
import { passengerDumbs } from './data-entity/passenger';
import { ridesDumbs } from './data-entity/rides';
describe('SeedersService', () => {
  let service: SeedersService;

  const mockPersonRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDriverRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockLocationRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRideRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockInvoiceRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockPassengerRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        { provide: getRepositoryToken(Person), useValue: mockPersonRepository },
        { provide: getRepositoryToken(Driver), useValue: mockDriverRepository },
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepository,
        },
        { provide: getRepositoryToken(Ride), useValue: mockRideRepository },
        {
          provide: getRepositoryToken(Invoice),
          useValue: mockInvoiceRepository,
        },
        {
          provide: getRepositoryToken(Passenger),
          useValue: mockPassengerRepository,
        },
      ],
    }).compile();

    service = module.get<SeedersService>(SeedersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seedPersonsData', () => {
    it('should create new persons if they do not exist', async () => {
      mockPersonRepository.findOne.mockResolvedValue(null);
      mockPersonRepository.create.mockImplementation((person) => person);
      mockPersonRepository.save.mockImplementation((person) =>
        Promise.resolve(person),
      );

      await service.seedPersonsData();

      for (const personData of personDumbs) {
        expect(mockPersonRepository.findOne).toHaveBeenCalledWith({
          where: { email: personData.email },
        });
        expect(mockPersonRepository.create).toHaveBeenCalledWith(personData);
        expect(mockPersonRepository.save).toHaveBeenCalledWith(personData);
      }
    });
  });

  describe('seedLocationsData', () => {
    it('should create new locations if they do not exist', async () => {
      mockLocationRepository.findOne.mockResolvedValue(null);
      mockLocationRepository.save.mockImplementation((location) =>
        Promise.resolve(location),
      );

      await service.seedLocationsData();

      for (const locationData of locationsDumbs) {
        expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
          where: {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
          },
        });
        expect(mockLocationRepository.save).toHaveBeenCalledWith(locationData);
      }
    });
  });

  describe('seedDriversData', () => {
    it('should create new drivers if they do not exist', async () => {
      for (const driverData of driversDumbs) {
        const person = { id: driverData.personId };
        const location = { id: driverData.locationId };

        mockPersonRepository.findOneBy.mockResolvedValue(person);
        mockLocationRepository.findOneBy.mockResolvedValue(location);
        mockDriverRepository.findOneBy.mockResolvedValue(null);
        mockDriverRepository.create.mockReturnValue(driverData);
        mockDriverRepository.save.mockResolvedValue(driverData);

        await service.seedDriversData();

        expect(mockDriverRepository.findOneBy).toHaveBeenCalledWith({ person });
        expect(mockDriverRepository.create).toHaveBeenCalledWith({
          person,
          location,
          available: driverData.available,
        });
        expect(mockDriverRepository.save).toHaveBeenCalledWith(driverData);
      }
    });
  });

  describe('seedPassengersData', () => {
    it('should create new passengers if they do not exist', async () => {
      for (const passengerData of passengerDumbs) {
        const person = { id: passengerData.personId };

        mockPersonRepository.findOneBy.mockResolvedValue(person);
        mockPassengerRepository.findOneBy.mockResolvedValue(null);
        mockPassengerRepository.create.mockReturnValue(passengerData);
        mockPassengerRepository.save.mockResolvedValue(passengerData);

        await service.seedPassengersData();

        expect(mockPassengerRepository.findOneBy).toHaveBeenCalledWith({
          person,
        });
        expect(mockPassengerRepository.create).toHaveBeenCalledWith({ person });
        expect(mockPassengerRepository.save).toHaveBeenCalledWith(
          passengerData,
        );
      }
    });
  });

  describe('seedInvoicesData', () => {
    it('should create new invoices if they do not exist', async () => {
      for (const invoiceData of invoicesDumbs) {
        const ride = { id: invoiceData.rideId };

        mockRideRepository.findOneBy.mockResolvedValue(ride);
        mockInvoiceRepository.findOneBy.mockResolvedValue(null);
        mockInvoiceRepository.create.mockReturnValue(invoiceData);
        mockInvoiceRepository.save.mockResolvedValue(invoiceData);

        await service.seedInvoicesData();

        expect(mockInvoiceRepository.findOneBy).toHaveBeenCalledWith({ ride });
        expect(mockInvoiceRepository.create).toHaveBeenCalledWith({
          ride,
          amount: invoiceData.amount,
          date: invoiceData.date,
        });
        expect(mockInvoiceRepository.save).toHaveBeenCalledWith(invoiceData);
      }
    });
  });
});

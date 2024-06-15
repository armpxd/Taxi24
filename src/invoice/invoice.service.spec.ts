import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { NotFoundException } from '@nestjs/common';
import { Passenger } from '../passenger/entities/passenger.entity';
import { Location } from '../location/entities/location.entity';
import { Driver } from '../driver/entities/driver.entity';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const location: Location = { id: 1, latitude: 40, longitude: 50 };
const passenger: Passenger = {
  id: 1,
  person: {
    id: 2,
    name: 'person',
    email: 'person@gmail.com',
    lastName: 'sacha',
    phoneNumber: '+1 809 386 0005',
  },
};
const driver: Driver = {
  id: 1,
  person: {
    id: 1,
    name: 'driver',
    email: 'driver@gmail.com',
    lastName: 'asd',
    phoneNumber: '+1 809 386 0005',
  },
  available: true,
  location,
};

const invoiceResult = [
  {
    id: 1,
    passengerId: 1,
    passengerName: 'Explorador 10',
    driverId: 1,
    driverName: ' Alvaro',
    amount: '48.5',
  },
  {
    id: 2,
    passengerId: 2,
    passengerName: 'Aventurero 1',
    driverId: 2,
    driverName: 'Explorador 2',
    amount: '50.4',
  },
];

describe('InvoicesService', () => {
  let service: InvoiceService;
  let repository: Repository<Invoice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(Invoice),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    repository = module.get<Repository<Invoice>>(getRepositoryToken(Invoice));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should throw NotFoundException if invoice with given ID is not found', async () => {
      const id = 99;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOneById(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`No invoice with the ${id}`);
      }
    });
  });
});

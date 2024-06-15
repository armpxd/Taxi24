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

const invoiceResult: Invoice[] = [
  {
    id: 1,
    date: new Date(),
    amount: 50,
    ride: {
      id: 1,
      passenger: {
        id: 1,
        person: {
          id: 2,
          name: 'person',
          lastName: 'sacha',
          email: 'person@gmail.com',
          phoneNumber: '+1 809 386 0005',
        },
      },
      driver: {
        id: 1,
        available: true,
        person: {
          id: 1,
          name: 'driver',
          lastName: 'asd',
          email: 'driver@gmail.com',
          phoneNumber: '+1 809 386 0005',
        },
        location: {
          id: 1,
          latitude: 40,
          longitude: 50,
        },
      },
      startLocation: {
        id: 1,
        latitude: 40,
        longitude: 50,
      },
      endLocation: {
        id: 1,
        latitude: 40,
        longitude: 50,
      },
      status: 'finished',
    },
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

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const mockInvoices = invoiceResult;
      jest.spyOn(repository, 'find').mockResolvedValue(mockInvoices);

      expect(await service.findAll()).toBe(mockInvoices);
    });
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

import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { Passenger } from '../passenger/entities/passenger.entity';
import { Location } from '../location/entities/location.entity';
import { Driver } from '../driver/entities/driver.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceService } from './invoice.service';

const location: Location = { id: 1, latitude: 40, longitude: 50 };
const passenger: Passenger = {
  id: 1,
  person: {
    id: 2,
    name: 'person',
    email: 'person@gmail.com',
    lastName: 'marcos',
    phoneNumber: '+1 809 324 3234',
  },
};
const driver: Driver = {
  id: 1,
  person: {
    id: 1,
    name: 'driver',
    email: 'driver@gmail.com',
    phoneNumber: '+1 809 324 3234',
    lastName: 'Lora',
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
      passenger,
      driver,
      startLocation: location,
      endLocation: location,
      status: 'finished',
    },
  },
];

class InvoiceServiceMock {
  findAll() {
    return invoiceResult;
  }

  findOneById() {
    return invoiceResult[0];
  }
}

describe('InvoicesController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useClass: InvoiceServiceMock,
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const result = invoiceResult;
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });
});

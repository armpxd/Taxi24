import { Test, TestingModule } from '@nestjs/testing';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { GetPassengerDto } from './dto/getPassenger.dto';
import { CreatePassengerDto } from './dto/createPassenger.dto';

const mockPassengerService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  createPassenger: jest.fn(),
};

describe('PassengerController', () => {
  let controller: PassengerController;
  let passengerService: PassengerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengerController],
      providers: [
        {
          provide: PassengerService,
          useValue: mockPassengerService,
        },
      ],
    }).compile();

    controller = module.get<PassengerController>(PassengerController);
    passengerService = module.get<PassengerService>(PassengerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of passengers', async () => {
      const passengers: GetPassengerDto[] = [
        {
          id: 1,
          name: 'John Doe',
          lastName: 'pera',
          phoneNumber: '+1 809 386 0005',
          email: 'asd@gmail.com',
        },
        {
          id: 2,
          name: 'Jane Smith',
          lastName: 'pez',
          phoneNumber: '+1 809 386 0002',
          email: 'sdas@gmail.com',
        },
      ];
      mockPassengerService.findAll.mockResolvedValue(passengers);

      const result = await controller.findAll();
      expect(result).toEqual(passengers);
      expect(passengerService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a passenger by id', async () => {
      const passenger: GetPassengerDto = {
        id: 1,
        name: 'John Doe',
        lastName: 'pera',
        phoneNumber: '+1 809 386 0005',
        email: 'asd@gmail.com',
      };
      const id = 1;
      mockPassengerService.findById.mockResolvedValue(passenger);

      const result = await controller.findById(id);
      expect(result).toEqual(passenger);
      expect(passengerService.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should create a new passenger', async () => {
      const createPassengerDto: CreatePassengerDto = {
        name: 'John',
        lastName: 'Doe',
        phoneNumber: '+1 234 567 8901',
        email: 'john.doe@example.com',
        id: 0,
      };
      const createdPassenger: GetPassengerDto = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        phoneNumber: '+1 234 567 8901',
        email: 'john.doe@example.com',
      };

      mockPassengerService.createPassenger.mockResolvedValue(createdPassenger);

      const result = await controller.create(createPassengerDto);
      expect(result).toEqual(createdPassenger);
      expect(passengerService.createPassenger).toHaveBeenCalledWith(
        createPassengerDto,
      );
    });
  });
});

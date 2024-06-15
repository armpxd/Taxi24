import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PassengerService } from './passenger.service';
import { Passenger } from './entities/passenger.entity';
import { Person } from '../person/entities/person.entity';
import { GetPassengerDto } from './dto/getPassenger.dto';
import { CreatePassengerDto } from './dto/createPassenger.dto';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const mockPassengerRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockPersonRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockEntityManager = {
  transaction: jest.fn(),
};

describe('PassengerService', () => {
  let service: PassengerService;
  let passengerRepository: Repository<Passenger>;
  let personRepository: Repository<Person>;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassengerService,
        {
          provide: getRepositoryToken(Passenger),
          useValue: mockPassengerRepository,
        },
        {
          provide: getRepositoryToken(Person),
          useValue: mockPersonRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<PassengerService>(PassengerService);
    passengerRepository = module.get<Repository<Passenger>>(
      getRepositoryToken(Passenger),
    );
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of passengers', async () => {
      const passengers: Passenger[] = [
        {
          id: 1,
          person: {
            id: 1,
            name: 'Explorador 10 ',
            lastName: 'Apellido10',
            phoneNumber: '+1 809 386 0010',
            email: 'explorador10@gmail.com',
          },
        },
        {
          id: 1,
          person: {
            id: 1,
            name: 'Explorador 11 ',
            lastName: 'Apellido11',
            phoneNumber: '+1 809 386 0011',
            email: 'explorador11@gmail.com',
          },
        },
      ];
      mockPassengerRepository.find.mockResolvedValue(passengers);

      const result = await service.findAll();
      expect(result).toEqual(passengers.map((p) => new GetPassengerDto(p)));
      expect(passengerRepository.find).toHaveBeenCalledWith({
        relations: ['person'],
      });
    });
  });

  describe('findById', () => {
    it('should return a passenger by id', async () => {
      const passenger = {
        id: 1,
        person: {
          id: 1,
          name: 'Explorador 12 ',
          lastName: 'Apellido12',
          phoneNumber: '+1 809 386 0012',
          email: 'explorador12@gmail.com',
        },
      };
      mockPassengerRepository.findOne.mockResolvedValue(passenger);

      const result = await service.findById(1);
      expect(result).toEqual(new GetPassengerDto(passenger));
      expect(passengerRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['person'],
      });
    });

    it('should throw BadRequestException if id is invalid', async () => {
      await expect(service.findById(NaN)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if passenger not found', async () => {
      mockPassengerRepository.findOne.mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';
import { PersonDto } from './dto/person.dto';

const mockPersonService = {
  findAll: jest.fn().mockResolvedValue([
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' },
  ]),
  create: jest.fn().mockResolvedValue({
    email: 'a.@gmail.com',
    id: 3,
    lastName: 'perez',
    name: 'Person 3',
    phoneNumber: '+1 809 324 3234',
  }),
  update: jest.fn().mockResolvedValue({
    email: 'a.@gmail.com',
    id: 1,
    lastName: 'perez',
    name: 'Updated Person',
    phoneNumber: '+1 809 324 3234',
  }),
  delete: jest.fn().mockResolvedValue(null),
};

describe('PersonController', () => {
  let controller: PersonController;
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        {
          provide: PersonService,
          useValue: mockPersonService,
        },
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
    service = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([
        { id: 1, name: 'Person 1' },
        { id: 2, name: 'Person 2' },
      ]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });
  describe('create', () => {
    it('should create and return a person', async () => {
      const personData: PersonDto = {
        name: 'Person 3',
        email: 'a.@gmail.com',
        lastName: 'perez',
        phoneNumber: '+1 809 324 3234',
      };
      const result = await controller.create(personData);

      console.log(result);
      expect(result).toEqual({
        email: 'a.@gmail.com',
        id: 3,
        lastName: 'perez',
        name: 'Person 3',
        phoneNumber: '+1 809 324 3234',
      });
      expect(service.create).toHaveBeenCalledWith(personData);
    });
  });

  describe('update', () => {
    it('should update and return the updated person', async () => {
      const personData: PersonDto = { name: 'Updated Person', email:'a.@gmail.com', lastName: "perez", phoneNumber: "+1 809 324 3234"  };
      const result = await controller.update('1', personData);
      expect(result).toEqual({ id: 1, name: 'Updated Person', email:'a.@gmail.com', lastName: "perez", phoneNumber: "+1 809 324 3234" });
      expect(service.update).toHaveBeenCalledWith(1, personData);
    });
  });

  describe('delete', () => {
    it('should delete a person', async () => {
      await controller.delete('1');
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});

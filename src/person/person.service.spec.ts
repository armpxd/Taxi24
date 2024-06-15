import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';
import { PersonDto } from './dto/person.dto';

const mockPersonRepository = {
  find: jest.fn().mockResolvedValue([
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' },
  ]),
  create: jest.fn().mockReturnValue({ id: 3, name: 'Person 3' }),
  save: jest.fn().mockResolvedValue({ id: 3, name: 'Person 3' }),
  update: jest.fn().mockResolvedValue(null),
  findOneBy: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Person' }),
  delete: jest.fn().mockResolvedValue(null),
};

describe('PersonService', () => {
  let service: PersonService;
  let repository: Repository<Person>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useValue: mockPersonRepository,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    repository = module.get<Repository<Person>>(getRepositoryToken(Person));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      const result = await service.findAll();
      expect(result).toEqual([
        { id: 1, name: 'Person 1' },
        { id: 2, name: 'Person 2' },
      ]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create and return a person', async () => {
      const personData: PersonDto = { name: 'Person 3', email: "a@gmail.com", phoneNumber: "+1 809 543 5469", lastName: "perez" };
      const result = await service.create(personData);
      expect(result).toEqual({ id: 3, name: 'Person 3' });
      expect(repository.create).toHaveBeenCalledWith(personData);
      expect(repository.save).toHaveBeenCalledWith({ id: 3, name: 'Person 3' });
    });
  });

  describe('update', () => {
    it('should update and return the updated person', async () => {
      const personData: Partial<PersonDto> = { name: 'Updated Person' };
      const result = await service.update(1, personData);
      expect(result).toEqual({ id: 1, name: 'Updated Person' });
      expect(repository.update).toHaveBeenCalledWith(1, personData);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('delete', () => {
    it('should delete a person', async () => {
      await service.delete(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});

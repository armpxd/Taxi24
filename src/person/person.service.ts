// person/person.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { CreatePersonDto } from './entities/person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async findAll(): Promise<Person[]> {
    return await this.personRepository.find();
  }

  async create(personData: CreatePersonDto): Promise<CreatePersonDto> {
    const newPerson = await this.personRepository.create(personData);
    return await this.personRepository.save(newPerson);
  }

  async update(id: number, personData: Partial<CreatePersonDto>): Promise<CreatePersonDto> {
    await this.personRepository.update(id, personData);
    return await this.personRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.personRepository.delete(id);
  }
}

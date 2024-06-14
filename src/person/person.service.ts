// person/person.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async findAll(): Promise<Person[]> {
    return await this.personRepository.find();
  }

  async create(personData: Partial<Person>): Promise<Person> {
    const newPerson = await this.personRepository.create(personData);
    return await this.personRepository.save(newPerson);
  }

  async update(id: number, personData: Partial<Person>): Promise<Person> {
    await this.personRepository.update(id, personData);
    return await this.personRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.personRepository.delete(id);
  }
}

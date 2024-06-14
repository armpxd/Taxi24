// person/person.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { PersonDto } from './dto/person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async findAll(): Promise<Person[]> {
    return await this.personRepository.find();
  }

  async create(personData: PersonDto): Promise<PersonDto> {
    const newPerson = await this.personRepository.create(personData);
    return await this.personRepository.save(newPerson);
  }

  async update(id: number, personData: Partial<PersonDto>): Promise<PersonDto> {
    await this.personRepository.update(id, personData);
    return await this.personRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.personRepository.delete(id);
  }
}

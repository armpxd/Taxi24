import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Passenger } from './entities/passenger.entity';
import { Person } from 'src/person/entities/person.entity';

@Injectable()
export class PassengerService {
  // constructor(
  //   @InjectRepository(Passenger)
  //   private readonly passengerRepository: Repository<Passenger>,
  // ){}
//     @InjectRepository(Person)
//     private readonly personRepository: Repository<Person>,
//     // private readonly entityManager: EntityManager,
//   ) {}

//   async getAll(): Promise<Passenger[]> {
//     return this.passengerRepository.find({ relations: ['person'] });
//   }
}

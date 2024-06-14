import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Passenger } from './entities/passenger.entity';
import { Person } from 'src/person/entities/person.entity';

@Injectable()
export class PassengerService {
  constructor(
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
  ) {}
  
  async findAll(): Promise<Passenger[]> {
    return await this.passengerRepository.find({ relations: ['person'] });
  }

  async findById(id: number): Promise<Passenger> {
    return await this.passengerRepository.findOne({
      where: { id },
      relations: ['person'],
    });
  }
}

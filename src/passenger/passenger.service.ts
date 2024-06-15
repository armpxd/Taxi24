import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Passenger } from './entities/passenger.entity';
import { GetPassengerDto } from './dto/getPassenger.dto';
import { CreatePassengerDto } from './dto/createPassenger.dto';
import { Person } from '../person/entities/person.entity';

@Injectable()
export class PassengerService {
  constructor(
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<GetPassengerDto[]> {
    const passengers: Passenger[] = await this.passengerRepository.find({
      relations: ['person'],
    });

    return passengers.map((passenger) => new GetPassengerDto(passenger));
  }

  async findById(id: number): Promise<GetPassengerDto> {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid id format');
    }

    const passenger: Passenger = await this.passengerRepository.findOne({
      where: { id },
      relations: ['person'],
    });

    if (!passenger) {
      throw new NotFoundException(`No found passenger with id ${id}`);
    }
    return new GetPassengerDto(passenger);
  }

  async createPassenger(
    passengerDto: CreatePassengerDto,
  ): Promise<GetPassengerDto> {
    const findPassanger = await this.personRepository.findOne({
      where: { email: passengerDto.email },
    });

    if (findPassanger) {
      throw new ConflictException('Exist a person with this email');
    }

    let createdPassenger: GetPassengerDto;

    await this.entityManager.transaction(async (entityManager) => {
      const { name, lastName, phoneNumber, email } = passengerDto;

      try {
        const person = this.personRepository.create({
          name,
          lastName,
          phoneNumber,
          email,
        });
        await entityManager.save(person);

        const passenger = this.passengerRepository.create({ person });
        await entityManager.save(passenger);

        createdPassenger = new GetPassengerDto(passenger);
      } catch (error) {
        throw new InternalServerErrorException(
          'Error creating passenger',
          error,
        );
      }
    });
    return createdPassenger;
  }
}

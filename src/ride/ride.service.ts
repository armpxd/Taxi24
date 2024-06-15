import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from 'src/driver/entities/driver.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Passenger } from 'src/passenger/entities/passenger.entity';
import { Ride } from './entities/ride.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateRideDto } from './dto/createRide.dto';
import { GetRideDto } from './dto/getRide.dto';
import { Location } from 'src/location/entities/location.entity';

@Injectable()
export class RideService {
  constructor(
    @InjectRepository(Ride) private readonly rideRepository: Repository<Ride>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<GetRideDto[]> {
    const rides: Ride[] = await this.rideRepository.find({
      relations: ['passenger', 'driver', 'startLocation', 'endLocation'],
    });
    return rides.map(
      (ride) =>
        new GetRideDto(
          ride.id,
          ride.passenger,
          ride.driver,
          ride.startLocation,
          ride.endLocation,
          ride.status,
        ),
    );
  }

  async findAllActive(): Promise<GetRideDto[]> {
    const rides: Ride[] = await this.rideRepository.find({
      where: { status: 'active' },
      relations: ['passenger', 'driver', 'startLocation', 'endLocation'],
    });
    return rides.map(
      (ride) =>
        new GetRideDto(
          ride.id,
          ride.passenger,
          ride.driver,
          ride.startLocation,
          ride.endLocation,
          ride.status,
        ),
    );
  }

  async findOneById(id: number): Promise<GetRideDto> {
    if (isNaN(id)) {
      throw new BadRequestException('id need to be a number');
    }

    const ride: Ride = await this.rideRepository.findOne({
      where: { id },
      relations: ['passenger', 'driver', 'startLocation', 'endLocation'],
    });

    if (!ride) {
      throw new NotFoundException('No ride was found with this ID');
    }

    return new GetRideDto(
      ride.id,
      ride.passenger,
      ride.driver,
      ride.startLocation,
      ride.endLocation,
      ride.status,
    );
  }

  async create(rideDto: CreateRideDto): Promise<Ride> {
    const driver = await this.driverRepository.findOneBy({
      id: rideDto.driverId,
    });

    if (!driver) {
      throw new NotFoundException(
        `No driver was found with the id: ${rideDto.driverId}`,
      );
    }
    const passenger = await this.passengerRepository.findOneBy({
      id: rideDto.passengerId,
    });

    if (!passenger) {
      throw new NotFoundException(
        `No passenger was found with the id: ${rideDto.passengerId}`,
      );
    }
    const availableRidePassenger = await this.rideRepository.findOneBy({
      passenger,
      status: 'active',
    });

    if (availableRidePassenger) {
      throw new BadRequestException(
        `the passenger with id: ${passenger.id} is currently on a ride`,
      );
    }
    let ride = new Ride();
    await this.entityManager.transaction(async (entityManager) => {
      const { startLatitude, startLongitude, endLatitude, endLongitude } =
        rideDto;

      try {
        await this.driverRepository.update(driver.id, { available: false });

        const startLocation = this.locationRepository.create({
          latitude: startLatitude,
          longitude: startLongitude,
        });
        await entityManager.save(startLocation);

        const endLocation = this.locationRepository.create({
          latitude: endLatitude,
          longitude: endLongitude,
        });
        await entityManager.save(endLocation);

        ride = this.rideRepository.create({
          driver,
          passenger,
          startLocation,
          endLocation,
          status: 'active',
        });
        await entityManager.save(ride);
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    });

    return ride;
  }

  async completeRide(id: number) {
    //Check if the ride exists
    const rideFound: Ride = await this.rideRepository.findOne({
      where: { id },
      relations: ['driver'],
    });

    if (!rideFound) {
      throw new NotFoundException('No ride was found with this ID');
    }

    if (rideFound.status !== 'active') {
      throw new BadRequestException(
        `Ride with ID ${id} is ${rideFound.status}, a ride with 'active' status is expected`,
      );
    }
    let rideUpdate;
    await this.entityManager.transaction(async (entityManager) => {
      try {
        await entityManager.update(
          Driver,
          { id: rideFound.driver.id },
          { available: true },
        );

        rideUpdate = await entityManager.update(Ride, id, {
          status: 'finished',
        });
      } catch (error) {
        throw new InternalServerErrorException('Error completing ride');
      }
    });

    return rideUpdate;
  }
}

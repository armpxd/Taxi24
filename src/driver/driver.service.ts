import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import {
  calculateDistance,
  calculateDistanceBetweenLocations,
} from 'src/helpers/utils';
import { GetDriverDto } from './dto/getDriver.dto';
import { CreateDriverDto } from './dto/createDriver.dto';
import { Person } from 'src/person/entities/person.entity';
import { Location } from 'src/location/entities/location.entity';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<GetDriverDto[]> {
    const drivers = await this.driverRepository.find({
      relations: ['person', 'location'],
    });
    return drivers.map((driver) => new GetDriverDto(driver));
  }

  async findAllAvailable(): Promise<GetDriverDto[]> {
    const availables = await this.driverRepository.find({
      where: { available: true },
      relations: ['person', 'location'],
    });
    return availables.map((driver) => new GetDriverDto(driver));
  }

  async findById(id: number): Promise<GetDriverDto> {
    if (isNaN(id)) {
      throw new BadRequestException('Id need to be a number');
    }
    const driver = await this.driverRepository.findOne({
      where: { id },
      relations: ['person', 'location'],
    });

    if (!driver) {
      throw new NotFoundException(`A driver with the ${id} was not found `);
    }
    return new GetDriverDto(driver);
  }

  async findAllAvailableWithinRadius(
    latitude: number,
    longitude: number,
    radius: number = 3,
  ): Promise<GetDriverDto[]> {
    const drivers = await this.driverRepository.find({
      where: { available: true },
      relations: ['location', 'person'],
    });

    const driversInRadius = drivers.filter((driver) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        driver.location.latitude,
        driver.location.longitude,
      );
      return distance <= radius;
    });
    return driversInRadius.map((driver) => new GetDriverDto(driver));
  }

  async findNearbyDrivers(
    latitud: number,
    longitude: number,
  ): Promise<GetDriverDto[]> {
    const availableDrivers = await this.findAllAvailable();

    if (!availableDrivers.length) {
      throw new NotFoundException('No available drivers nears');
    }

    const distanceDriversMap: Map<number, GetDriverDto> = new Map();
    let sortedDrivers: GetDriverDto[] = [];

    availableDrivers.forEach((driver) => {
      // Get distance in km between the provided location and the driver location
      const distance: number = calculateDistanceBetweenLocations(
        latitud,
        longitude,
        +driver.latitude,
        +driver.longitude,
      );

      distanceDriversMap.set(distance, driver);
    });

    // Sort drivers by distance and add just 3 to the result list
    const sortedKeys = Array.from(distanceDriversMap.keys()).sort();
    for (const key of sortedKeys) {
      sortedDrivers.push(distanceDriversMap.get(key));
    }

    return sortedDrivers.slice(0, 3);
  }

  async createDriver(driver: CreateDriverDto): Promise<GetDriverDto> {
    const driverFound = await this.personRepository.findOne({
      where: { email: driver.email },
    });

    //Check if there is another person with this email
    if (driverFound) {
      throw new ConflictException(
        'There is an existing person with this email',
      );
    }

    let createdDriverObject: GetDriverDto;

    await this.entityManager.transaction(async (entityManager) => {
      const {
        name,
        lastName,
        email,
        latitude,
        longitude,
        available,
        phoneNumber,
      } = driver;

      try {
        // Create person record
        const person: Person = this.personRepository.create({
          name,
          lastName,
          email,
          phoneNumber,
        });
        await entityManager.save(person);

        // Create location record
        const location: Location = this.locationRepository.create({
          latitude,
          longitude,
        });
        await entityManager.save(location);

        // Create driver record
        const driver: Driver = this.driverRepository.create({
          person,
          location,
          available,
        });
        await entityManager.save(driver);

        createdDriverObject = new GetDriverDto(driver);
      } catch (error) {
        throw new InternalServerErrorException('Error creating driver', error);
      }
    });

    return createdDriverObject;
  }
}

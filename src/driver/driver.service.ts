import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import {
  calculateDistance,
  calculateDistanceBetweenLocations,
} from 'src/helpers/utils';
import { GetDriverDto } from './dto/getDriver.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
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
}

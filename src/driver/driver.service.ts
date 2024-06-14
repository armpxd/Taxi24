import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import {
  calculateDistance,
  calculateDistanceBetweenLocations,
} from 'src/helpers/utils';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async findAll(): Promise<Driver[]> {
    return await this.driverRepository.find({
      relations: ['person', 'location'],
    });
  }

  async findAllAvailable(): Promise<Driver[]> {
    return await this.driverRepository.find({
      where: { available: true },
      relations: ['person', 'location'],
    });
  }

  async findById(id: number): Promise<Driver> {
    return await this.driverRepository.findOneBy({ id });
  }

  async findAllAvailableWithinRadius(
    latitude: number,
    longitude: number,
    radius: number = 3,
  ): Promise<Driver[]> {
    const drivers = await this.driverRepository.find({
      where: { available: true },
      relations: ['location'],
    });

    return drivers.filter((driver) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        driver.location.latitude,
        driver.location.longitude,
      );
      return distance <= radius;
    });
  }

  async findNearbyDrivers(
    latitud: number,
    longitude: number,
  ): Promise<Driver[]> {
    const availableDrivers = await this.findAllAvailable();

    if (!availableDrivers.length) {
      throw new NotFoundException('No available drivers nears');
    }

    const distanceDriversMap: Map<number, Driver> = new Map();
    let sortedDrivers: Driver[] = [];

    availableDrivers.forEach((driver) => {
      // Get distance in km between the provided location and the driver location
      const distance: number = calculateDistanceBetweenLocations(
        latitud,
        longitude,
        +driver.location.latitude,
        +driver.location.longitude,
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

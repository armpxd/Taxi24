// src/driver/driver.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { DriverService } from './driver.service';
import { Driver } from './entities/driver.entity';

@Controller('api/drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  async findAll(): Promise<Driver[]> {
    return this.driverService.findAll();
  }

  @Get('available')
  async findAllAvailable(): Promise<Driver[]> {
    return this.driverService.findAllAvailable();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Driver> {
    return this.driverService.findById(id);
  }

  @Get('available3km/:latitude/:longitude')
  async findAllAvailableWithinRadius(
    @Param('latitude') latitude: string,
    @Param('longitude') longitude: string, // Radio por defecto de 3 km
  ): Promise<Driver[]> {
    return this.driverService.findAllAvailableWithinRadius(
      parseFloat(latitude),
      parseFloat(longitude),
    );
  }

  @Get('findNearbyDrivers/:latitude/:longitude')
  async find3AvailableDrivers(
    @Param('latitude') latitude: string,
    @Param('longitude') longitude: string,
  ): Promise<Driver[]> {
    return this.driverService.findNearbyDrivers(
      parseFloat(latitude),
      parseFloat(longitude),
    );
  }
}

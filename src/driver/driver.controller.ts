import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DriverService } from './driver.service';
import { Driver } from './entities/driver.entity';
import { GetDriverDto } from './dto/getDriver.dto';
import { CreateDriverDto } from './dto/createDriver.dto';

@Controller('api/drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  async findAll(): Promise<GetDriverDto[]> {
    return this.driverService.findAll();
  }

  @Get('availables')
  async findAllAvailable(): Promise<GetDriverDto[]> {
    return this.driverService.findAllAvailable();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<GetDriverDto> {
    return this.driverService.findById(id);
  }

  @Get('available3km/:latitude/:longitude')
  async findAllAvailableWithinRadius(
    @Param('latitude') latitude: string,
    @Param('longitude') longitude: string,
  ): Promise<GetDriverDto[]> {
    return this.driverService.findAllAvailableWithinRadius(
      parseFloat(latitude),
      parseFloat(longitude),
    );
  }

  @Get('findNearbyDrivers/:latitude/:longitude')
  async find3AvailableDrivers(
    @Param('latitude') latitude: string,
    @Param('longitude') longitude: string,
  ): Promise<GetDriverDto[]> {
    return this.driverService.findNearbyDrivers(
      parseFloat(latitude),
      parseFloat(longitude),
    );
  }

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.createDriver(createDriverDto);
  }
}

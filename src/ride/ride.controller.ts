import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/createRide.dto';

@Controller('api/rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Get()
  findAll() {
    return this.rideService.findAll();
  }
  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.rideService.findOneById(+id);
  }

  @Get('/status/active')
  findAllActive() {
    return this.rideService.findAllActive();
  }

  @Post()
  create(@Body() createRideDto: CreateRideDto) {
    return this.rideService.create(createRideDto);
  }

  @Patch('complete/:id')
  completeRide(@Param('id') id: string) {
    return this.rideService.completeRide(+id);
  }
}

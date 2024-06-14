// src/passenger/passenger.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { Passenger } from './entities/passenger.entity';

@Controller('api/passengers')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Get()
  async findAll(): Promise<Passenger[]> {
    return this.passengerService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Passenger> {
    return this.passengerService.findById(id);
  }
}

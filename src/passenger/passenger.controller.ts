// src/passenger/passenger.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { Passenger } from './entities/passenger.entity';
import { GetPassengerDto } from './dto/getPassenger.dto';
import { CreatePassengerDto } from './dto/createPassenger.dto';

@Controller('api/passengers')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Get()
  async findAll(): Promise<GetPassengerDto[]> {
    return this.passengerService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<GetPassengerDto> {
    return this.passengerService.findById(id);
  }

  @Post()
  create(@Body() createPassengerDto: CreatePassengerDto) {
    return this.passengerService.createPassenger(createPassengerDto);
  }
}

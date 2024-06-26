import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { Person } from '../person/entities/person.entity';
import { Passenger } from './entities/passenger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger, Person])],
  controllers: [PassengerController],
  providers: [PassengerService],
})
export class PassengerModule {}

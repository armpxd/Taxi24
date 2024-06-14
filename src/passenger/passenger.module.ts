import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { Person } from 'src/person/entities/person.entity';
import { Passenger } from './entities/passenger.entity';

@Module({
  // imports: [TypeOrmModule.forFeature([Passenger])],
  controllers: [PassengerController],
  providers: [PassengerService],
})
export class PassengerModule {}

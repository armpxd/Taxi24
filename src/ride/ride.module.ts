import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ride } from './entities/ride.entity';
import { Passenger } from '../passenger/entities/passenger.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Driver } from '../driver/entities/driver.entity';
import { Location } from '../location/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ride, Passenger, Driver, Location, Invoice]),
  ],
  providers: [RideService],
  controllers: [RideController],
})
export class RideModule {}

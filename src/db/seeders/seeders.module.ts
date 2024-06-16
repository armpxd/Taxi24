import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { Person } from '../../person/entities/person.entity';
import { Ride } from '../../ride/entities/ride.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { Passenger } from '../../passenger/entities/passenger.entity';
import { Location } from '../../location/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Person,
      Driver,
      Location,
      Ride,
      Invoice,
      Passenger,
    ]),
  ],
  providers: [SeedersService],
})
export class SeedersModule {}

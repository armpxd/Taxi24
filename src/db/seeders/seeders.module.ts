import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { Person } from 'src/person/entities/person.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Passenger } from 'src/passenger/entities/passenger.entity';
import { Location } from 'src/location/entities/location.entity';

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

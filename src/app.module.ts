import { Module } from '@nestjs/common';

import { DriverModule } from './driver/driver.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { PersonModule } from './person/person.module';
import { PassengerModule } from './passenger/passenger.module';
import { LocationService } from './location/location.service';
import { LocationController } from './location/location.controller';
import { LocationModule } from './location/location.module';
import { InvoiceModule } from './invoice/invoice.module';
import { RideService } from './ride/ride.service';
import { RideController } from './ride/ride.controller';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [
    DriverModule,
    DbModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PersonModule,
    PassengerModule,
    LocationModule,
    InvoiceModule,
    RideModule,
  ],
  controllers: [LocationController, RideController],
  providers: [LocationService, RideService],
})
export class AppModule {}

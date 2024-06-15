import { Module } from '@nestjs/common';
import { DriverModule } from './driver/driver.module';
import { PersonModule } from './person/person.module';
import { PassengerModule } from './passenger/passenger.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { LocationModule } from './location/location.module';
import { InvoiceModule } from './invoice/invoice.module';
import { RideModule } from './ride/ride.module';
import { SeedersModule } from './db/seeders/seeders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    PassengerModule,
    PersonModule,
    LocationModule,
    DriverModule,
    InvoiceModule,
    RideModule,
    SeedersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

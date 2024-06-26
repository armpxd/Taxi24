import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { Driver } from './entities/driver.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../person/entities/person.entity';
import { Location } from '../location/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, Person, Location])],
  providers: [DriverService],
  controllers: [DriverController],
})
export class DriverModule {}

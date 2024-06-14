import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { Driver } from './entities/driver.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Driver])],
  providers: [DriverService],
  controllers: [DriverController]
})
export class DriverModule {}

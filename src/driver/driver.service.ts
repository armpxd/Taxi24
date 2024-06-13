import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DriverService {
  // constructor(
  //   @InjectRepository(Driver)
  //   private readonly driverRepository: Repository<Driver>,
  //   private readonly entityManager: EntityManager,
  // ) {}
}

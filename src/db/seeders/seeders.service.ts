import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Passenger } from 'src/passenger/entities/passenger.entity';
import { Person } from 'src/person/entities/person.entity';
import { Repository } from 'typeorm';
import { Driver } from 'src/driver/entities/driver.entity';
import { Location } from 'src/location/entities/location.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { personDumbs } from './data-entity/person';
import { locationsDumbs } from './data-entity/locations';
import { driversDumbs } from './data-entity/driver';
import { passengerDumbs } from './data-entity/passenger';
import { ridesDumbs } from './data-entity/rides';
import { invoicesDumbs } from './data-entity/invoices';

@Injectable()
export class SeedersService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Ride) private readonly rideRepository: Repository<Ride>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
  ) {}

  async seedData() {
    await this.seedPersonsData();
    await this.seedLocationsData();
    await this.seedDriversData();
    await this.seedPassengersData();
    await this.seedRidesData();
    await this.seedInvoicesData();
  }

  async seedPersonsData() {
    for (const data of personDumbs) {
      // Check if data with the same email exists
      const existingPerson = await this.personRepository.findOne({
        where: { email: data.email },
      });

      if (!existingPerson) {
        // Person doesn't exist, so insert it
        const person = this.personRepository.create(data);
        await this.personRepository.save(person);
      } else {
        console.log('PERSON: There is existing data');
      }
    }
  }

  async seedLocationsData() {
    for (const data of locationsDumbs) {
      // Check if data with the same latitude,longitude exists
      const existingLocation = await this.locationRepository.findOne({
        where: { latitude: data.latitude, longitude: data.longitude },
      });

      if (!existingLocation) {
        // Location doesn't exist, so insert it
        await this.locationRepository.save(data);
      } else {
        console.log('LOCATION: There is existing data');
      }
    }
  }

  async seedDriversData() {
    for (const data of driversDumbs) {
      // Check if driver with the same person exists
      const person = await this.personRepository.findOneBy({
        id: data.personId,
      });
      const existingDriver = await this.driverRepository.findOneBy({ person });

      if (!existingDriver) {
        // Driver doesn't exist, so insert it
        const { available } = data;
        const location = await this.locationRepository.findOneBy({
          id: data.locationId,
        });

        const driver: Driver = this.driverRepository.create({
          person,
          location,
          available,
        });
        await this.driverRepository.save(driver);
      } else {
        console.log('DRIVER: There is existing data');
      }
    }
  }

  async seedPassengersData() {
    for (const data of passengerDumbs) {
      // Check if passenger with the same person exists
      const person = await this.personRepository.findOneBy({
        id: data.personId,
      });
      const existinPassenger = await this.passengerRepository.findOneBy({
        person,
      });

      if (!existinPassenger) {
        const passenger = this.passengerRepository.create({ person });
        await this.passengerRepository.save(passenger);
      } else {
        console.log('PASSENGER: There is existing data');
      }
    }
  }

  async seedRidesData() {
    for (const data of ridesDumbs) {
      const passenger = await this.passengerRepository.findOneBy({
        id: data.passengerId,
      });
      const driver = await this.driverRepository.findOneBy({
        id: data.driverId,
      });
      const startLocation = await this.locationRepository.findOneBy({
        id: data.startLocationId,
      });
      const endLocation = await this.locationRepository.findOneBy({
        id: data.endLocationId,
      });

      // Check if ride with the same passenger,driver,startLocation,endLocation exists
      const existingRide = await this.rideRepository.findOneBy({
        passenger,
        driver,
        startLocation,
        endLocation,
      });

      if (!existingRide) {
        // Data doesn't exist, so insert it
        const ride = this.rideRepository.create({
          passenger,
          driver,
          startLocation,
          endLocation,
          status: data.status,
        });
        await this.rideRepository.save(ride);
      } else {
        console.log('RIDE: There is existing data');
      }
    }
  }

  async seedInvoicesData() {
    for (const data of invoicesDumbs) {
      // Check if invoice with the same ride exists
      const ride = await this.rideRepository.findOneBy({ id: data.rideId });

      const existingInvoice = await this.invoiceRepository.findOneBy({ ride });

      if (!existingInvoice) {
        const { amount, date } = data;
        // Data doesn't exist, so insert it
        const invoice = await this.invoiceRepository.create({
          ride,
          amount,
          date,
        });
        await this.invoiceRepository.save(invoice);
      } else {
        console.log('INVOICE: There is existing data');
      }
    }
  }
}

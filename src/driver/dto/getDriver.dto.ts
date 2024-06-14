import { Driver } from '../entities/driver.entity';
import { IsPhoneNumber } from 'class-validator';

export class GetDriverDto {
  constructor(driver: Driver) {
    this.id = driver.id;
    this.name = `${driver.person.name} ${driver.person.lastName}`;
    this.email = driver.person.email;
    this.phoneNumber = driver.person.phoneNumber;
    this.latitude = driver.location.latitude;
    this.longitude = driver.location.longitude;
    this.available = driver.available;
  }

  id: number;

  name: string;

  email: string;

  phoneNumber: string;

  latitude: number;

  longitude: number;

  available: boolean;
}

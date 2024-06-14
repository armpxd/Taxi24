import { Passenger } from '../entities/passenger.entity';

export class GetPassengerDto {
  constructor(passenger: Passenger) {
    this.id = passenger.id;
    this.name = passenger.person.name;
    this.lastName = passenger.person.lastName;
    this.phoneNumber = passenger.person.phoneNumber;
    this.email = passenger.person.email;
  }

  id: number;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

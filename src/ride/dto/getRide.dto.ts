import { Driver } from '../../driver/entities/driver.entity';
import { Location } from '../../location/entities/location.entity';
import { Passenger } from '../../passenger/entities/passenger.entity';
export class GetRideDto {
  constructor(
    id: number,
    passenger: Passenger,
    driver: Driver,
    startLocation: Location,
    endLocation: Location,
    status: string,
  ) {
    this.id = id;
    this.passengerId = passenger.id;
    this.driverId = driver.id;
    this.startLocationId = startLocation.id;
    this.endLocationId = endLocation.id;
    this.status = status;
  }

  id: number;

  passengerId: number;

  driverId: number;

  startLocationId: number;

  endLocationId: number;

  status: string;
}

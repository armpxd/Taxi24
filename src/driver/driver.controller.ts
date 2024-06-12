import { Controller, Get } from '@nestjs/common';

@Controller('driver')
export class DriverController {
  @Get()
  getDrivers() {
    return 'getting drivers';
  }
}

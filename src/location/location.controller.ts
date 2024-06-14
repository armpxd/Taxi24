import { Controller, Get } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('/api/locations')
export class LocationController {
  constructor(private readonly locationsService: LocationService) {}

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }
}

// person/person.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';
import { PersonDto } from './entities/person.dto';

@Controller('api/persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  async findAll(): Promise<Person[]> {
    return this.personService.findAll();
  }

  @Post()
  async create(@Body() personData: PersonDto): Promise<PersonDto> {
    return this.personService.create(personData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() personData: PersonDto,
  ): Promise<PersonDto> {
    const personId = parseInt(id, 10);
    return this.personService.update(personId, personData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const personId = parseInt(id, 10);
    return this.personService.delete(personId);
  }
}

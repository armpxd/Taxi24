import { NestFactory } from '@nestjs/core';
import { SeedersService } from './seeders.service';
import { AppModule } from '../../app.module';

async function seedData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeedersService);

  await seederService.seedData();

  await app.close();
}

seedData();
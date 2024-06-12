import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const DbConnection = [
  {
    provide: 'DataSource',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: configService.get('PG_PORT'),
        username: configService.get('PG_USERNAME'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: true, // Setting true in production environments is not recommended.
        logging: configService.get('enviroment') === 'development',
        migrationsTableName: 'migrations',
        entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
        migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
      });
      return await dataSource.initialize();
    },
    inject: [ConfigService],
  },
];

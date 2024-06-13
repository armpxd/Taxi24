import { Location } from 'src/location/entities/location.entity';
import { Person } from 'src/person/entities/person.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('drive')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Person, (person) => person.id, { onDelete: 'SET NULL' })
  @JoinColumn()
  person_id: Person;

  @OneToOne(() => Location, (location) => location.id, { onDelete: 'SET NULL' })
  @JoinColumn()
  location_id: Location;

  @Column()
  available: boolean;
}

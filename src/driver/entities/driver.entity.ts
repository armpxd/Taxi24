import { Location } from '../../location/entities/location.entity';
import { Person } from '../../person/entities/person.entity';
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
  person: Person;

  @OneToOne(() => Location, (location) => location.id, { onDelete: 'SET NULL' })
  @JoinColumn()
  location: Location;

  @Column()
  available: boolean;
}

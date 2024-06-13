import { Person } from 'src/person/entities/person.entity';
import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

@Entity('passenger')
export class Passenger {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(()=> Person, person => person.id, {onDelete: 'SET NULL'})
  @JoinColumn()
  person_id: Person



}

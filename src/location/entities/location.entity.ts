import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  latitude: string;

  @Column()
  longitude: string;
}

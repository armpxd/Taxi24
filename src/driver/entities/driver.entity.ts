import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('drive')
export class Driver {
  @PrimaryGeneratedColumn()
  driver_id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  longitude: number;

  @Column({ default: true })
  is_available: boolean;
}

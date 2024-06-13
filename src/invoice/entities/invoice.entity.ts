import { Ride } from 'src/ride/entities/ride.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Ride, ride => ride.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    ride: Ride;

  @Column('decimal')
  amount: string;

  @Column()
  Date: string;
}

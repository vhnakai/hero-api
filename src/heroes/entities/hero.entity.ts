import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hero {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varying character', length: 120 })
  name: string;

  @Column({ type: 'varying character', length: 120, unique: true })
  heroName: string;

  @Column({ type: 'datetime', nullable: true })
  birthDate: Date;

  @Column('float')
  heigth: number;

  @Column('float')
  weigh: number;
}

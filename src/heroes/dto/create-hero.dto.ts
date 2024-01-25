import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHeroDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  heroName: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @IsNotEmpty()
  @IsNumber()
  heigth: number;

  @IsNotEmpty()
  @IsNumber()
  weigh: number;
}

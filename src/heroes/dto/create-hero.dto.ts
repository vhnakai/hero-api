import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHeroDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  heroName: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  birthDate: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  heigth: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  weigh: number;
}

import { IsNotEmpty } from 'class-validator';

export class CreateHeroDto {
  @IsNotEmpty()
  name: string;

  power: string;
}

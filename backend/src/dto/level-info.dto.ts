import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class LevelInfoDto {
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsNotEmpty()
  level: number;

  @Transform(({ value }) => +value)
  @IsNumber()
  @IsPositive()
  minNumOfMoves: number;
}

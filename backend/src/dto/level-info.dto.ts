import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LevelInfoDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @IsNotEmpty()
  level: number;
}

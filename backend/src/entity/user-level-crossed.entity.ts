import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserLevelCrossed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  levelCrossed: number;

  @Column()
  minNumOfMoves: number;
}

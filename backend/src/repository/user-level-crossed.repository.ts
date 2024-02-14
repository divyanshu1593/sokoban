import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LevelInfoDto } from 'src/dto/level-info.dto';
import { UserLevelCrossed } from 'src/entity/user-level-crossed.entity';
import { DataSource, Repository } from 'typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class UserLevelCrossedRepository extends Repository<UserLevelCrossed> {
  constructor(
    private dataSource: DataSource,
    private userRepository: UserRepository,
  ) {
    super(UserLevelCrossed, dataSource.createEntityManager());
  }

  async addCrossedLevel(crossedLevelInfo: LevelInfoDto) {
    const { username, level } = crossedLevelInfo;

    if (!(await this.userRepository.findOneBy({ username }))) {
      throw new UnauthorizedException();
    }

    if (await this.findOneBy({ username, levelCrossed: level })) {
      return;
    }

    await this.insert({
      username,
      levelCrossed: level,
    });
  }

  async isLevelCrossed(levelInfo: LevelInfoDto) {
    const { username, level } = levelInfo;

    if (await this.findOneBy({ username, levelCrossed: level })) {
      return true;
    }

    return false;
  }

  async getLevelCrossed(username: string) {
    return await this.createQueryBuilder('userLevelCrossed')
      .select('userLevelCrossed.levelCrossed')
      .where('userLevelCrossed.username = :username', { username })
      .getMany();
  }
}

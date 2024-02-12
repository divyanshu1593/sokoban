import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UserCredentialsDto } from 'src/dto/user-credentials.dto';
import { User } from 'src/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signup(userCredentialsDto: UserCredentialsDto) {
    const { username, password } = userCredentialsDto;

    if (await this.findOneBy({ username })) {
      throw new NotAcceptableException('username already exist');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    return await this.insert({
      username,
      password: passwordHash,
    });
  }
}

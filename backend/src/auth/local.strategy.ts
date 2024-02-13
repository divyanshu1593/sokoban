import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserRepository } from 'src/repository/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.userRepository.verifySignin({ username, password });

    if (!user) throw new UnauthorizedException();

    delete user.password;
    return user;
  }
}

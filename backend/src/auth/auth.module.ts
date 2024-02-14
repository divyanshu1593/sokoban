import { Module } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [PassportModule],
  providers: [UserRepository, LocalStrategy, LocalAuthGuard, AuthService],
  exports: [LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

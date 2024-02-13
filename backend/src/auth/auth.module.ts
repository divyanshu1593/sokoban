import { Module } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LocalAuthGuard } from './local-auth.guard';

@Module({
  imports: [PassportModule],
  providers: [UserRepository, LocalStrategy, LocalAuthGuard],
  exports: [LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
  ],
  providers: [
    UserRepository,
    LocalStrategy,
    LocalAuthGuard,
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [LocalStrategy, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}

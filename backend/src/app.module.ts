import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserLevelCrossed } from './entity/user-level-crossed.entity';
import { UserLevelCrossedRepository } from './repository/user-level-crossed.repository';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, UserLevelCrossed]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/data.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserLevelCrossedRepository, UserRepository],
})
export class AppModule {}

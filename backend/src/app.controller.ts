import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserLevelCrossedRepository } from './repository/user-level-crossed.repository';
import { CustomResponse } from './types/response.type';
import { UserLevelCrossed } from './entity/user-level-crossed.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private userLevelCrossedRepo: UserLevelCrossedRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('get-crossed-levels')
  async getLevelCrossed(
    @Request() request,
  ): Promise<CustomResponse<UserLevelCrossed[]>> {
    return {
      isError: false,
      message: '',
      data: await this.userLevelCrossedRepo.getLevelCrossed(
        request.user.username,
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('is-level-crossed/:level')
  async isLevelCrossed(
    @Request() request,
    @Param('level') level,
  ): Promise<CustomResponse<boolean>> {
    return {
      isError: false,
      message: '',
      data: await this.userLevelCrossedRepo.isLevelCrossed({
        username: request.user.username,
        level,
      }),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-crossed-level')
  async addCrossedLevel(
    @Request() request,
    @Body('levelCrossed') levelCrossed: number,
  ): Promise<CustomResponse<null>> {
    await this.userLevelCrossedRepo.addCrossedLevel({
      username: request.user.username,
      level: levelCrossed,
    });

    return {
      isError: false,
      message: '',
      data: null,
    };
  }
}

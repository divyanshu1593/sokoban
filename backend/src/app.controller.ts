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
import { LevelInfoDto } from './dto/level-info.dto';
import { CrossedLevelInfo } from './types/crossed-level-info.interface';

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
  @Get('level-crossed-info/:level')
  async isLevelCrossed(
    @Request() request,
    @Param() levelObj: Omit<LevelInfoDto, 'minNumOfMoves'>,
  ): Promise<CustomResponse<CrossedLevelInfo>> {
    return {
      isError: false,
      message: '',
      data: await this.userLevelCrossedRepo.isLevelCrossed(
        request.user.username,
        levelObj.level,
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-crossed-level')
  async addCrossedLevel(
    @Request() request,
    @Body() levelInfo: LevelInfoDto,
  ): Promise<CustomResponse<null>> {
    await this.userLevelCrossedRepo.addCrossedLevel(
      request.user.username,
      levelInfo,
    );

    return {
      isError: false,
      message: '',
      data: null,
    };
  }
}

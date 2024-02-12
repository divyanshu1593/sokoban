import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserRepository } from './repository/user.repository';
import { CustomResponse } from './types/response.type';
import { InsertResult } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private userRepository: UserRepository,
  ) {}

  @Post('signup')
  async signup(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<CustomResponse<InsertResult>> {
    return {
      isError: false,
      message: '',
      data: await this.userRepository.signup(userCredentialsDto),
    };
  }
}

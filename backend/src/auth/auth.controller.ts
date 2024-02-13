import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { CustomResponse } from 'src/types/response.type';
import { InsertResult } from 'typeorm';
import { UserRepository } from 'src/repository/user.repository';

@Controller('auth')
export class AuthController {
  constructor(private userRepository: UserRepository) {}

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

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(@Request() request) {
    return request.user;
  }
}

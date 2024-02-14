import { Injectable } from '@nestjs/common';
import { UserJwtPayload } from 'src/types/user-jwt-payload.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  getJwtToken(payload: UserJwtPayload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY);
  }
}

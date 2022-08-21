import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequestDto, AuthResponseDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /**
   * Authenticates the user and provides an access token if the user is
   *  authorized to access resources
   */
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(
    @Body() { username, password }: AuthRequestDto,
  ): Promise<AuthResponseDto> {
    return this.auth.login(username, password);
  }
}

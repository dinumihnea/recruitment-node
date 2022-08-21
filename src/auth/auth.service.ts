import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { AuthResponseDto } from './dto/auth.dto';
import { EncryptionService } from './encryption.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  /**
   * @throws UnauthorizedException when user is not found
   * @throws UnauthorizedException when password doesn't match
   * @throws UnauthorizedException when user is not active
   * @param username unique identifier of the user trying to log in
   * @param password user's password to be checked
   */
  async login(username: string, password: string): Promise<AuthResponseDto> {
    const user = await this.authenticate(username);

    await this.validate(user, password);

    const accessToken = await this.authorize(user);

    return { accessToken };
  }

  isUserAuthorized(user: User): boolean {
    return user.isActive;
  }

  async authenticate(username: string): Promise<User> {
    const user = await this.userService.findByUsernameIncludePassword(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private async authorize(user: User): Promise<string> {
    if (!this.isUserAuthorized(user)) {
      throw new UnauthorizedException();
    }
    return this.tokenService.generateAccessToken({ sub: user.username });
  }

  private async validate(user: User, password: string): Promise<void> {
    const isPasswordMatch = await this.encryptionService.compare(
      password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }
  }
}

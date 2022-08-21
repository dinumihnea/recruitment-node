import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../common/config-keys';

export interface TokenPayload {
  /**
   * The subject claim identifies the principal that is the subject of the JWT
   * https://datatracker.ietf.org/doc/html/rfc7519.html#section-4.1.2
   */
  sub: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @throws InternalServerErrorException when token sign fails
   * @param payload the JWT payload
   */
  async generateAccessToken(payload: TokenPayload): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload, {
        secret: this.configService.get(CONFIG_KEYS.ACCESS_TOKEN_SIGN_KEY),
        expiresIn: this.configService.get(CONFIG_KEYS.ACCESS_TOKEN_EXPIRES_IN),
      });
    } catch (e) {
      console.error(`Unable to generate JWT token for sub:${payload.sub}`, e);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Checks if token's signature matches
   * @param token jwt to be checked
   * @returns jwt payload
   */
  async validateAccessToken(token: string): Promise<TokenPayload | null> {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.configService.get(CONFIG_KEYS.ACCESS_TOKEN_SIGN_KEY),
      });
    } catch (e) {
      console.error(`JWT verification failed token:${token}`, e);
      return null;
    }
  }
}

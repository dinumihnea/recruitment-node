import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { UserType } from '../user/user.schema';

// NestJS normalizes header keys to lowercase
export const AUTH_HEADER_KEY = 'authorization';

export const AUTH_BEARER_PREFIX = 'Bearer ';

export type RequestWithUser = Request & { user: UserType };

/**
 * Checks the 'authorization' header, validates the token and populates the user
 *  in the Request object if current user is authorized.
 *
 * The CurrentUser decorator can be used in the request handlers to have the value of request['user']
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  private async validateRequest(request: Request): Promise<boolean> {
    const authHeader = request.headers[AUTH_HEADER_KEY];
    if (!authHeader?.startsWith(AUTH_BEARER_PREFIX)) {
      return false;
    }

    const tokenPayload = await this.tokenService.validateAccessToken(
      authHeader.substring(AUTH_BEARER_PREFIX.length, authHeader.length),
    );
    if (!tokenPayload || !tokenPayload.sub) {
      return false;
    }

    let user;
    try {
      user = await this.authService.authenticate(tokenPayload.sub);
    } catch {
      return false;
    }

    if (!user || !this.authService.isUserAuthorized(user)) {
      return false;
    }

    // SIDE EFFECT - populates user property for future use in the controllers
    request['user'] = user;
    return true;
  }
}

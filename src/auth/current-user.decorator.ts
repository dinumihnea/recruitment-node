import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './auth.guard';
import { UserType } from '../user/user.schema';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserType => {
    const request: RequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

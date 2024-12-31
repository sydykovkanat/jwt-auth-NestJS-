import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator((key: keyof User, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return key ? request.user[key] : request.user;
});

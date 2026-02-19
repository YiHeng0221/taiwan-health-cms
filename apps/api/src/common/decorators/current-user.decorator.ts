/**
 * @fileoverview Current User Decorator
 * 
 * Extracts the authenticated user from the request object.
 * Use with @CurrentUser() to get the current user in controllers.
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@taiwan-health/shared-types';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);

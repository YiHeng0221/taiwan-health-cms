/**
 * @fileoverview Public Route Decorator
 * 
 * Marks a route as public (no authentication required).
 * Used with JwtAuthGuard to skip authentication for specific routes.
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

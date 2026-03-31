import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../../modules/auth/guards/roles.guard';
import { UserRole } from '@taiwan-health/shared-types';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

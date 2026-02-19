/**
 * @fileoverview Prisma Database Module
 * 
 * Global module that provides PrismaService throughout the application.
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

/**
 * @fileoverview Tags Module (標籤)
 *
 * This module handles tag management for articles:
 * - Public tag listing for filter dropdowns
 * - Admin CRUD operations
 */

import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}

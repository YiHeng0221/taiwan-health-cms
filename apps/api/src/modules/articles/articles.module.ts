/**
 * @fileoverview Articles Module (運動專欄)
 * 
 * This module handles all article-related operations including:
 * - Public article listing and detail view
 * - Admin CRUD operations
 * - SEO-optimized slugs
 */

import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}

/**
 * @fileoverview Upload Controller
 *
 * Endpoints for uploading images to Supabase Storage.
 * All upload endpoints require authentication.
 */

import {
  Controller,
  Post,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  UploadedFiles,
  Query,
  Delete,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators';
import { UserRole } from '@taiwan-health/shared-types';

const ALLOWED_FOLDERS = ['articles', 'events', 'settings', 'services', 'home-sections'];

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload a single image
   * POST /api/upload/image?folder=articles
   */
  @Post('image')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('請上傳檔案');
    }

    const resolvedFolder = folder || 'articles';
    if (!ALLOWED_FOLDERS.includes(resolvedFolder)) {
      throw new BadRequestException(
        `無效的資料夾名稱。允許的資料夾: ${ALLOWED_FOLDERS.join(', ')}`,
      );
    }

    return this.uploadService.uploadImage(file, resolvedFolder);
  }

  /**
   * Upload multiple images
   * POST /api/upload/images?folder=events
   */
  @Post('images')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('請上傳至少一個檔案');
    }

    const resolvedFolder = folder || 'articles';
    if (!ALLOWED_FOLDERS.includes(resolvedFolder)) {
      throw new BadRequestException(
        `無效的資料夾名稱。允許的資料夾: ${ALLOWED_FOLDERS.join(', ')}`,
      );
    }

    return this.uploadService.uploadImages(files, resolvedFolder);
  }

  /**
   * Delete an image by URL
   * DELETE /api/upload/image
   */
  @Delete('image')
  async deleteImage(@Body('url') url: string) {
    if (!url) {
      throw new BadRequestException('請提供圖片 URL');
    }
    await this.uploadService.deleteImage(url);
    return { message: '圖片已刪除' };
  }
}

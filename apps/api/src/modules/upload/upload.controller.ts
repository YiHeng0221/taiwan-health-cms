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
  UploadedFile,
  UploadedFiles,
  Query,
  Delete,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { memoryStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  /**
   * Upload a single image
   * POST /api/upload/image?folder=articles
   */
  @Post('image')
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
    return this.uploadService.uploadImage(file, folder || 'articles');
  }

  /**
   * Upload multiple images
   * POST /api/upload/images?folder=events
   */
  @Post('images')
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
    return this.uploadService.uploadImages(files, folder || 'articles');
  }

  /**
   * Delete an image by URL
   * DELETE /api/upload/image
   */
  @Delete('image')
  async deleteImage(@Body('url') url: string) {
    await this.uploadService.deleteImage(url);
    return { message: '圖片已刪除' };
  }
}

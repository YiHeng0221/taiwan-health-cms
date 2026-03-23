/**
 * @fileoverview Upload Service
 *
 * Handles file uploads to Supabase Storage.
 * Files are stored in the 'images' bucket with public access.
 */

import { Injectable, BadRequestException, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import * as path from 'path';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const BUCKET_NAME = 'lys_health';

@Injectable()
export class UploadService implements OnModuleInit {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(UploadService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Auto-create the storage bucket if it doesn't exist
   */
  async onModuleInit() {
    const { data: buckets } = await this.supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET_NAME);

    if (!exists) {
      const { error } = await this.supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ALLOWED_MIME_TYPES,
        fileSizeLimit: MAX_FILE_SIZE,
      });

      if (error) {
        this.logger.error(`無法建立 Storage bucket: ${error.message}`);
      } else {
        this.logger.log(`✅ Storage bucket "${BUCKET_NAME}" 已自動建立`);
      }
    } else {
      this.logger.log(`Storage bucket "${BUCKET_NAME}" 已存在`);
    }
  }

  /**
   * Upload a single image file to Supabase Storage
   * @returns Public URL of the uploaded image
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'articles',
  ): Promise<{ url: string }> {
    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `不支援的檔案格式。支援格式: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('檔案大小不能超過 10MB');
    }

    // Generate unique filename
    const ext = path.extname(file.originalname) || this.getExtFromMime(file.mimetype);
    const filename = `${folder}/${randomUUID()}${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`上傳失敗: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl };
  }

  /**
   * Upload multiple image files
   */
  async uploadImages(
    files: Express.Multer.File[],
    folder: string = 'articles',
  ): Promise<{ urls: string[] }> {
    const results = await Promise.all(
      files.map((file) => this.uploadImage(file, folder)),
    );
    return { urls: results.map((r) => r.url) };
  }

  /**
   * Delete an image from Supabase Storage
   */
  async deleteImage(url: string): Promise<void> {
    // Extract path from URL
    const bucketUrl = `/storage/v1/object/public/${BUCKET_NAME}/`;
    const urlObj = new URL(url);
    const filePath = urlObj.pathname.split(bucketUrl).pop();

    if (!filePath) {
      throw new BadRequestException('無效的圖片 URL');
    }

    const { error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw new BadRequestException(`刪除失敗: ${error.message}`);
    }
  }

  private getExtFromMime(mime: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
    };
    return map[mime] || '.jpg';
  }
}

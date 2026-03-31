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
];

const ALLOWED_FOLDERS = ['articles', 'events', 'settings', 'services', 'home-sections'];

function validateMagicBytes(buffer: Buffer, mimetype: string): boolean {
  if (buffer.length < 12) return false;

  switch (mimetype) {
    case 'image/jpeg':
      return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    case 'image/png':
      return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    case 'image/gif':
      return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38;
    case 'image/webp':
      return (
        buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
      );
    default:
      return false;
  }
}

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

    // Validate magic bytes
    if (!validateMagicBytes(file.buffer, file.mimetype)) {
      throw new BadRequestException('檔案內容與宣告的格式不符');
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
      this.logger.error(`上傳失敗: ${error.message}`);
      throw new BadRequestException('檔案上傳失敗，請稍後再試');
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

    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      throw new BadRequestException('無效的圖片 URL 格式');
    }

    const filePath = urlObj.pathname.split(bucketUrl).pop();

    if (!filePath) {
      throw new BadRequestException('無效的圖片 URL');
    }

    // Validate the file path starts with an allowed folder to prevent path traversal
    const isAllowedPath = ALLOWED_FOLDERS.some((folder) => filePath.startsWith(`${folder}/`));
    if (!isAllowedPath) {
      throw new BadRequestException('無效的檔案路徑');
    }

    const { error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      this.logger.error(`刪除失敗: ${error.message}`);
      throw new BadRequestException('檔案刪除失敗，請稍後再試');
    }
  }

  private getExtFromMime(mime: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
    };
    return map[mime] || '.jpg';
  }
}

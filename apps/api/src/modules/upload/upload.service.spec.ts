import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';

// Mock supabase
const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn();
const mockRemove = jest.fn();
const mockListBuckets = jest.fn();
const mockCreateBucket = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    storage: {
      listBuckets: mockListBuckets,
      createBucket: mockCreateBucket,
      from: () => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
        remove: mockRemove,
      }),
    },
  }),
}));

const mockConfigService = {
  get: jest.fn((key: string) => {
    const map: Record<string, string> = {
      SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'test-key',
    };
    return map[key];
  }),
};

function createMockFile(
  mimetype: string,
  buffer: Buffer,
  size?: number,
): Express.Multer.File {
  return {
    mimetype,
    buffer,
    size: size ?? buffer.length,
    originalname: 'test.jpg',
    fieldname: 'file',
    encoding: '7bit',
    stream: null as any,
    destination: '',
    filename: '',
    path: '',
  };
}

// Valid magic bytes
const JPEG_BYTES = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0, 0, 0, 0, 0, 0, 0, 0]);
const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0, 0, 0, 0, 0, 0, 0, 0]);
const GIF_BYTES = Buffer.from([0x47, 0x49, 0x46, 0x38, 0, 0, 0, 0, 0, 0, 0, 0]);
const WEBP_BYTES = Buffer.from([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload a valid JPEG', async () => {
      mockUpload.mockResolvedValue({ data: { path: 'articles/uuid.jpg' }, error: null });
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://cdn.test/articles/uuid.jpg' } });

      const file = createMockFile('image/jpeg', JPEG_BYTES);
      const result = await service.uploadImage(file, 'articles');

      expect(result.url).toBe('https://cdn.test/articles/uuid.jpg');
    });

    it('should upload a valid PNG', async () => {
      mockUpload.mockResolvedValue({ data: { path: 'articles/uuid.png' }, error: null });
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://cdn.test/articles/uuid.png' } });

      const file = createMockFile('image/png', PNG_BYTES);
      const result = await service.uploadImage(file, 'articles');
      expect(result.url).toBeDefined();
    });

    it('should reject unsupported MIME type', async () => {
      const file = createMockFile('image/svg+xml', Buffer.alloc(12));

      await expect(service.uploadImage(file)).rejects.toThrow(BadRequestException);
    });

    it('should reject file with mismatched magic bytes', async () => {
      // Claims to be JPEG but has PNG magic bytes
      const file = createMockFile('image/jpeg', PNG_BYTES);

      await expect(service.uploadImage(file)).rejects.toThrow(BadRequestException);
    });

    it('should reject file exceeding size limit', async () => {
      const bigBuffer = Buffer.concat([JPEG_BYTES, Buffer.alloc(11 * 1024 * 1024)]);
      const file = createMockFile('image/jpeg', bigBuffer, 11 * 1024 * 1024);

      await expect(service.uploadImage(file)).rejects.toThrow(BadRequestException);
    });

    it('should throw on Supabase upload error', async () => {
      mockUpload.mockResolvedValue({ data: null, error: { message: 'fail' } });

      const file = createMockFile('image/jpeg', JPEG_BYTES);
      await expect(service.uploadImage(file)).rejects.toThrow(BadRequestException);
    });
  });

  describe('uploadImages', () => {
    it('should upload multiple files', async () => {
      mockUpload.mockResolvedValue({ data: { path: 'articles/uuid.jpg' }, error: null });
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://cdn.test/img.jpg' } });

      const files = [
        createMockFile('image/jpeg', JPEG_BYTES),
        createMockFile('image/png', PNG_BYTES),
      ];

      const result = await service.uploadImages(files, 'articles');
      expect(result.urls).toHaveLength(2);
    });
  });

  describe('deleteImage', () => {
    it('should delete image with valid path', async () => {
      mockRemove.mockResolvedValue({ error: null });

      await expect(
        service.deleteImage('https://test.supabase.co/storage/v1/object/public/lys_health/articles/uuid.jpg'),
      ).resolves.toBeUndefined();
    });

    it('should reject invalid URL', async () => {
      await expect(service.deleteImage('not-a-url')).rejects.toThrow(BadRequestException);
    });

    it('should reject path traversal attempt', async () => {
      await expect(
        service.deleteImage('https://test.supabase.co/storage/v1/object/public/lys_health/../../../etc/passwd'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw on Supabase delete error', async () => {
      mockRemove.mockResolvedValue({ error: { message: 'fail' } });

      await expect(
        service.deleteImage('https://test.supabase.co/storage/v1/object/public/lys_health/articles/uuid.jpg'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

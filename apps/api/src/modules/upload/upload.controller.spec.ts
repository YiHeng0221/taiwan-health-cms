import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

const mockUploadResult = {
  url: 'https://supabase.co/storage/v1/object/public/images/test.jpg',
};

const mockService = {
  uploadImage: jest.fn(),
  uploadImages: jest.fn(),
  deleteImage: jest.fn(),
};

const createMockFile = (name = 'test.jpg'): Express.Multer.File => ({
  fieldname: 'file',
  originalname: name,
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]),
  size: 1024,
  stream: null as any,
  destination: '',
  filename: name,
  path: '',
});

describe('UploadController', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [{ provide: UploadService, useValue: mockService }],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload single image with default folder', async () => {
      mockService.uploadImage.mockResolvedValue(mockUploadResult);

      const result = await controller.uploadImage(createMockFile(), undefined);
      expect(result).toEqual(mockUploadResult);
      expect(mockService.uploadImage).toHaveBeenCalledWith(expect.any(Object), 'articles');
    });

    it('should upload to specified folder', async () => {
      mockService.uploadImage.mockResolvedValue(mockUploadResult);

      await controller.uploadImage(createMockFile(), 'events');
      expect(mockService.uploadImage).toHaveBeenCalledWith(expect.any(Object), 'events');
    });

    it('should throw BadRequestException if no file', async () => {
      await expect(controller.uploadImage(undefined as any, undefined)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid folder', async () => {
      await expect(controller.uploadImage(createMockFile(), 'malicious')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('uploadImages', () => {
    it('should upload multiple images', async () => {
      mockService.uploadImages.mockResolvedValue([mockUploadResult, mockUploadResult]);
      const files = [createMockFile('a.jpg'), createMockFile('b.jpg')];

      const result = await controller.uploadImages(files, 'events');
      expect(result).toHaveLength(2);
    });

    it('should throw BadRequestException if no files', async () => {
      await expect(controller.uploadImages([], undefined)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if files is null', async () => {
      await expect(controller.uploadImages(null as any, undefined)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteImage', () => {
    it('should delete image and return message', async () => {
      mockService.deleteImage.mockResolvedValue(undefined);

      const result = await controller.deleteImage('https://supabase.co/test.jpg');
      expect(result).toEqual({ message: '圖片已刪除' });
    });

    it('should throw BadRequestException if no url', async () => {
      await expect(controller.deleteImage('')).rejects.toThrow(BadRequestException);
    });
  });
});

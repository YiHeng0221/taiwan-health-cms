import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

const mockArticle = {
  id: 'art-1',
  title: '測試文章',
  slug: 'test-article',
  content: { type: 'doc', content: [] },
  coverImage: null,
  metaDescription: null,
  isPublished: true,
  authorId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPaginated = {
  items: [mockArticle],
  total: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

const mockService = {
  findAll: jest.fn(),
  findBySlug: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  togglePublish: jest.fn(),
  remove: jest.fn(),
};

describe('ArticlesController', () => {
  let controller: ArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [{ provide: ArticlesService, useValue: mockService }],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    jest.clearAllMocks();
  });

  describe('findAll (public)', () => {
    it('should force isPublished=true and return paginated articles', async () => {
      mockService.findAll.mockResolvedValue(mockPaginated);

      const result = await controller.findAll({ page: 1, pageSize: 10 });

      expect(result).toEqual(mockPaginated);
      expect(mockService.findAll).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        isPublished: true,
      });
    });
  });

  describe('findBySlug (public)', () => {
    it('should return published article', async () => {
      mockService.findBySlug.mockResolvedValue(mockArticle);

      const result = await controller.findBySlug('test-article');
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException for unpublished article', async () => {
      mockService.findBySlug.mockResolvedValue({ ...mockArticle, isPublished: false });

      await expect(controller.findBySlug('test-article')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllAdmin', () => {
    it('should return all articles without forcing isPublished', async () => {
      mockService.findAll.mockResolvedValue(mockPaginated);

      const result = await controller.findAllAdmin({ page: 1, pageSize: 10 });

      expect(result).toEqual(mockPaginated);
      expect(mockService.findAll).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
    });
  });

  describe('findById', () => {
    it('should return article by id', async () => {
      mockService.findById.mockResolvedValue(mockArticle);

      const result = await controller.findById('art-1');
      expect(result).toEqual(mockArticle);
    });
  });

  describe('create', () => {
    it('should create article with authorId from current user', async () => {
      mockService.create.mockResolvedValue(mockArticle);
      const user = { id: 'user-1', email: 'admin@test.com', role: 'ADMIN' } as any;

      const result = await controller.create(
        { title: '測試文章', content: { type: 'doc', content: [] } },
        user,
      );

      expect(result).toEqual(mockArticle);
      expect(mockService.create).toHaveBeenCalledWith(
        { title: '測試文章', content: { type: 'doc', content: [] } },
        'user-1',
      );
    });
  });

  describe('update', () => {
    it('should update article', async () => {
      const updated = { ...mockArticle, title: '更新' };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update('art-1', { title: '更新' });
      expect(result.title).toBe('更新');
      expect(mockService.update).toHaveBeenCalledWith('art-1', { title: '更新' });
    });
  });

  describe('togglePublish', () => {
    it('should toggle publish status', async () => {
      mockService.togglePublish.mockResolvedValue({ ...mockArticle, isPublished: false });

      const result = await controller.togglePublish('art-1');
      expect(result.isPublished).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete article and return message', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('art-1');
      expect(result).toEqual({ message: '文章已刪除' });
      expect(mockService.remove).toHaveBeenCalledWith('art-1');
    });
  });
});

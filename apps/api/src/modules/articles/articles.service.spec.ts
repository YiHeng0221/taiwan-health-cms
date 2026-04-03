import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockArticle = {
  id: 'art-1',
  title: '測試文章',
  slug: 'test-article',
  content: { type: 'doc', content: [] },
  coverImage: null,
  metaDescription: null,
  isPublished: false,
  authorId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  article: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('ArticlesService', () => {
  let service: ArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create article with generated slug', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);
      mockPrisma.article.create.mockResolvedValue(mockArticle);

      const result = await service.create({
        title: '測試文章',
        content: { type: 'doc', content: [] },
      });

      expect(result).toEqual(mockArticle);
      expect(mockPrisma.article.create).toHaveBeenCalled();
    });

    it('should throw ConflictException on duplicate slug', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(mockArticle);

      await expect(
        service.create({ title: '測試文章', slug: 'test-article', content: { type: 'doc', content: [] } }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated articles', async () => {
      mockPrisma.article.count.mockResolvedValue(1);
      mockPrisma.article.findMany.mockResolvedValue([mockArticle]);

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should filter by isPublished', async () => {
      mockPrisma.article.count.mockResolvedValue(0);
      mockPrisma.article.findMany.mockResolvedValue([]);

      await service.findAll({ page: 1, pageSize: 10, isPublished: true });

      const countCall = mockPrisma.article.count.mock.calls[0][0];
      expect(countCall.where.isPublished).toBe(true);
    });

    it('should support search', async () => {
      mockPrisma.article.count.mockResolvedValue(0);
      mockPrisma.article.findMany.mockResolvedValue([]);

      await service.findAll({ page: 1, pageSize: 10, search: '健康' });

      const countCall = mockPrisma.article.count.mock.calls[0][0];
      expect(countCall.where.OR).toBeDefined();
    });
  });

  describe('findBySlug', () => {
    it('should return article when found', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(mockArticle);

      const result = await service.findBySlug('test-article');
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when not found', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return article when found', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(mockArticle);

      const result = await service.findById('art-1');
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when not found', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);

      await expect(service.findById('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update article', async () => {
      const updated = { ...mockArticle, title: '更新標題' };
      mockPrisma.article.findUnique.mockResolvedValue(mockArticle);
      mockPrisma.article.findFirst.mockResolvedValue(null);
      mockPrisma.article.update.mockResolvedValue(updated);

      const result = await service.update('art-1', { title: '更新標題' });
      expect(result.title).toBe('更新標題');
    });

    it('should throw ConflictException on duplicate slug', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(mockArticle);
      mockPrisma.article.findFirst.mockResolvedValue({ id: 'other', slug: 'taken' });

      await expect(
        service.update('art-1', { slug: 'taken' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if article does not exist', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);

      await expect(service.update('nope', { title: 'x' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete article', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(mockArticle);
      mockPrisma.article.delete.mockResolvedValue(mockArticle);

      await expect(service.remove('art-1')).resolves.toBeUndefined();
      expect(mockPrisma.article.delete).toHaveBeenCalledWith({ where: { id: 'art-1' } });
    });

    it('should throw NotFoundException if article not found', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);

      await expect(service.remove('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('togglePublish', () => {
    it('should toggle from false to true', async () => {
      const unpublished = { ...mockArticle, isPublished: false };
      mockPrisma.article.findUnique.mockResolvedValue(unpublished);
      mockPrisma.article.update.mockResolvedValue({ ...unpublished, isPublished: true });

      const result = await service.togglePublish('art-1');
      expect(result.isPublished).toBe(true);
      expect(mockPrisma.article.update).toHaveBeenCalledWith({
        where: { id: 'art-1' },
        data: { isPublished: true },
      });
    });

    it('should toggle from true to false', async () => {
      const published = { ...mockArticle, isPublished: true };
      mockPrisma.article.findUnique.mockResolvedValue(published);
      mockPrisma.article.update.mockResolvedValue({ ...published, isPublished: false });

      const result = await service.togglePublish('art-1');
      expect(result.isPublished).toBe(false);
      expect(mockPrisma.article.update).toHaveBeenCalledWith({
        where: { id: 'art-1' },
        data: { isPublished: false },
      });
    });
  });
});

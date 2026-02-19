/**
 * @fileoverview Create Article DTO
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsObject,
} from 'class-validator';
import { TiptapContent } from '@taiwan-health/shared-types';

export class CreateArticleDto {
  @IsString({ message: '標題必須為字串' })
  @IsNotEmpty({ message: '標題為必填' })
  @MaxLength(200, { message: '標題最多200個字元' })
  title: string;

  @IsString({ message: '網址代稱必須為字串' })
  @IsOptional()
  @MaxLength(200, { message: '網址代稱最多200個字元' })
  slug?: string;

  @IsObject({ message: '內容格式錯誤' })
  @IsNotEmpty({ message: '內容為必填' })
  content: TiptapContent;

  @IsString({ message: '封面圖片必須為字串' })
  @IsOptional()
  coverImage?: string;

  @IsString({ message: 'Meta Description 必須為字串' })
  @IsOptional()
  @MaxLength(160, { message: 'Meta Description 最多160個字元' })
  metaDescription?: string;

  @IsBoolean({ message: '發布狀態必須為布林值' })
  @IsOptional()
  isPublished?: boolean;
}

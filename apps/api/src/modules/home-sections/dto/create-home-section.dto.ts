/**
 * @fileoverview Create Home Section DTO
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsObject,
  IsIn,
} from 'class-validator';
import { HomeSectionType, HomeSectionConfig } from '@taiwan-health/shared-types';

const SECTION_TYPES: HomeSectionType[] = [
  'banner',
  'carousel',
  'features',
  'testimonials',
  'cta',
  'services',
];

export class CreateHomeSectionDto {
  @IsString()
  @IsNotEmpty({ message: '區塊類型為必填' })
  @IsIn(SECTION_TYPES, { message: '無效的區塊類型' })
  type: HomeSectionType;

  @IsObject({ message: '配置格式錯誤' })
  @IsNotEmpty({ message: '配置為必填' })
  config: HomeSectionConfig;

  @IsOptional()
  @IsInt({ message: '排序必須為整數' })
  order?: number;

  @IsOptional()
  @IsBoolean({ message: '啟用狀態必須為布林值' })
  isActive?: boolean;
}

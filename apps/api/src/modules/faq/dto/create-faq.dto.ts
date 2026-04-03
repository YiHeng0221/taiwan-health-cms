/**
 * @fileoverview Create FAQ DTO
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateFaqDto {
  @IsString({ message: '問題必須為字串' })
  @IsNotEmpty({ message: '問題為必填' })
  question: string;

  @IsString({ message: '答案必須為字串' })
  @IsNotEmpty({ message: '答案為必填' })
  answer: string;

  @IsOptional()
  @IsInt({ message: '排序必須為整數' })
  order?: number;

  @IsOptional()
  @IsBoolean({ message: '啟用狀態必須為布林值' })
  isActive?: boolean;
}

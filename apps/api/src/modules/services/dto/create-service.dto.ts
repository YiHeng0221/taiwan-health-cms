import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsString({ message: '標題必須為字串' })
  @IsNotEmpty({ message: '標題為必填' })
  @MaxLength(200, { message: '標題最多200個字元' })
  title: string;

  @IsString({ message: '描述必須為字串' })
  @IsNotEmpty({ message: '描述為必填' })
  @MaxLength(5000, { message: '描述最多5000個字元' })
  description: string;

  @IsOptional()
  @IsString({ message: '圖示必須為字串' })
  @MaxLength(50, { message: '圖示名稱最多50個字元' })
  icon?: string;

  @IsOptional()
  @IsString({ message: '圖片必須為字串' })
  image?: string;

  @IsOptional()
  @IsArray({ message: '特色必須為陣列' })
  @IsString({ each: true, message: '每項特色必須為字串' })
  features?: string[];

  @IsOptional()
  @IsInt({ message: '排序必須為整數' })
  order?: number;

  @IsOptional()
  @IsBoolean({ message: '啟用狀態必須為布林值' })
  isActive?: boolean;
}

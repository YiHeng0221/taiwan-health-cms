import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @IsString({ message: '標題必須為字串' })
  @IsNotEmpty({ message: '標題為必填' })
  @MaxLength(200, { message: '標題最多200個字元' })
  title: string;

  @IsString({ message: '網址代稱必須為字串' })
  @IsNotEmpty({ message: '網址代稱為必填' })
  @MaxLength(200, { message: '網址代稱最多200個字元' })
  slug: string;

  @IsString({ message: '描述必須為字串' })
  @IsNotEmpty({ message: '描述為必填' })
  @MaxLength(5000, { message: '描述最多5000個字元' })
  description: string;

  @IsDateString({}, { message: '日期格式無效' })
  @IsNotEmpty({ message: '日期為必填' })
  date: string;

  @IsString({ message: '地點必須為字串' })
  @IsNotEmpty({ message: '地點為必填' })
  @MaxLength(200, { message: '地點最多200個字元' })
  location: string;

  @IsOptional()
  @IsArray({ message: '圖片必須為陣列' })
  @IsString({ each: true, message: '每張圖片必須為字串' })
  images?: string[];

  @IsOptional()
  @IsBoolean({ message: '發布狀態必須為布林值' })
  isPublished?: boolean;
}

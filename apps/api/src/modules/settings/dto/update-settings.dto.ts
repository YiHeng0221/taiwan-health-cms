import { IsString, IsOptional, IsObject, MaxLength } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString({ message: '網站名稱必須為字串' })
  @MaxLength(100, { message: '網站名稱最多100個字元' })
  siteName?: string;

  @IsOptional()
  @IsString({ message: 'Logo 必須為字串' })
  logo?: string;

  @IsOptional()
  @IsString({ message: 'Favicon 必須為字串' })
  favicon?: string;

  @IsOptional()
  @IsObject({ message: 'Footer 配置格式錯誤' })
  footer?: Record<string, unknown>;

  @IsOptional()
  @IsObject({ message: '社群媒體配置格式錯誤' })
  social?: Record<string, unknown>;

  @IsOptional()
  @IsObject({ message: '聯絡資訊配置格式錯誤' })
  contact?: Record<string, unknown>;
}

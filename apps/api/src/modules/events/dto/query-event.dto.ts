import { IsOptional, IsBoolean, IsInt, Min, Max, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryEventDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '頁碼必須為整數' })
  @Min(1, { message: '頁碼最小為1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每頁數量必須為整數' })
  @Min(1, { message: '每頁數量最小為1' })
  @Max(100, { message: '每頁數量最大為100' })
  pageSize?: number = 10;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: '發布狀態必須為布林值' })
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  search?: string;
}

/**
 * @fileoverview Create Tag DTO
 */

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsString({ message: '標籤名稱必須為字串' })
  @IsNotEmpty({ message: '標籤名稱為必填' })
  @MaxLength(50, { message: '標籤名稱最多50個字元' })
  name: string;
}

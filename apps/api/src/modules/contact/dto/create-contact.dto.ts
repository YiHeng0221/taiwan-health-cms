/**
 * @fileoverview Create Contact DTO
 */

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: '姓名為必填' })
  @MaxLength(50, { message: '姓名最多50個字元' })
  name: string;

  @IsEmail({}, { message: '請輸入有效的電子郵件' })
  @IsNotEmpty({ message: '電子郵件為必填' })
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: '電話最多20個字元' })
  phone?: string;

  @IsString()
  @IsNotEmpty({ message: '主旨為必填' })
  @MaxLength(100, { message: '主旨最多100個字元' })
  subject: string;

  @IsString()
  @IsNotEmpty({ message: '訊息內容為必填' })
  @MaxLength(2000, { message: '訊息最多2000個字元' })
  message: string;
}

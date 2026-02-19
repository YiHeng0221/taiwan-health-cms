/**
 * @fileoverview Login DTO with validation
 */

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: '請輸入有效的電子郵件' })
  @IsNotEmpty({ message: '電子郵件為必填' })
  email: string;

  @IsString({ message: '密碼必須為字串' })
  @IsNotEmpty({ message: '密碼為必填' })
  @MinLength(6, { message: '密碼至少需要6個字元' })
  password: string;
}

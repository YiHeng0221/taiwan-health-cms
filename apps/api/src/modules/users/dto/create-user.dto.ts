import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail({}, { message: '請輸入有效的電子郵件' })
  @IsNotEmpty({ message: '電子郵件為必填' })
  email: string;

  @IsString({ message: '密碼必須為字串' })
  @IsNotEmpty({ message: '密碼為必填' })
  @MinLength(6, { message: '密碼至少需要6個字元' })
  @MaxLength(128, { message: '密碼最多128個字元' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: '無效的角色，允許的值: ADMIN, EDITOR' })
  role?: UserRole;
}

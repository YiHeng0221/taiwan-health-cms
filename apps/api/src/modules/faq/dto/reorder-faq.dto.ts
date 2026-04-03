import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class ReorderFaqDto {
  @IsArray({ message: '排序 ID 列表必須為陣列' })
  @ArrayNotEmpty({ message: '排序 ID 列表不能為空' })
  @IsString({ each: true, message: '每個 ID 必須為字串' })
  orderedIds: string[];
}

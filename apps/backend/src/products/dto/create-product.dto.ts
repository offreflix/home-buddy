import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  unit: string = 'unidade';

  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @IsNotEmpty()
  @IsInt()
  desiredQuantity: number;

  @IsOptional()
  @IsInt()
  currentQuantity: number = 0;
}

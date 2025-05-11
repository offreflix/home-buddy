import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Ingredient {
  @IsString()
  name: string;
}

export class GenerateRecipesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Ingredient)
  ingredients: Ingredient[];
}

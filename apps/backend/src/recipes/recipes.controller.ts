import { Body, Controller, Post } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { GenerateRecipesDto } from './dto/generate-recipes.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post('generate')
  generate(@Body() dto: GenerateRecipesDto) {
    return this.recipesService.generateWithAI(dto.ingredients);
  }
}

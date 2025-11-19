import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Response,
  Header,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { ExportProductsDto } from './dto/export-products.dto';
import { User } from 'src/users/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExportService } from './export.service';

@ApiTags('export')
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('products')
  @ApiOperation({ summary: 'Exportar produtos em formato CSV ou JSON' })
  @ApiResponse({
    status: 200,
    description: 'Arquivo de exportação gerado com sucesso',
  })
  @Header('Content-Type', 'text/csv')
  async exportProducts(
    @Query() dto: ExportProductsDto,
    @User() user: UserEntity,
    @Response() res: ExpressResponse,
  ) {
    const fileName = `produtos_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const csvData = await this.exportService.exportProductsAsCsv(user, dto);

    res.send(csvData);
  }

  @Get('reports/stock-summary')
  @ApiOperation({ summary: 'Gerar relatório resumido do estoque' })
  @ApiResponse({
    status: 200,
    description: 'Relatório gerado com sucesso',
  })
  async generateStockSummaryReport(@User() user: UserEntity) {
    return this.exportService.generateStockSummaryReport(user);
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { HistoricalPriceDto } from 'src/common/product.dto';
import { ProductService } from './product.service';

@Controller('aresa-api')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('initialize')
  async createProduct(): Promise<any> {
    return await this.productService.initializeProducts();
  }

  @Get('historical_price')
  async getHistoricalPrice(@Body() data: HistoricalPriceDto) {
    console.log(data);
    return await this.productService.getHistoricalPrice({ data });
  }
}

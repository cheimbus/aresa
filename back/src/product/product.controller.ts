import { Body, Controller, Get, Post } from '@nestjs/common';
import { FuturePriceDto, HistoricalPriceDto } from 'src/common/product.dto';
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
    return await this.productService.getHistoricalPrice(data);
  }

  @Post('historical_price')
  async setHistoricalPrice(@Body() data: HistoricalPriceDto) {
    return await this.productService.setHistoricalPrice(data);
  }

  @Get('future_price')
  async getFuturePrice(@Body() data: FuturePriceDto) {
    return await this.productService.getFuturePrice(data);
  }

  @Post('future_price')
  async setFuturePrice(@Body() data: HistoricalPriceDto) {
    return await this.productService.setFuturePrice(data);
  }
}

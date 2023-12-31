import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FuturePriceDto, HistoricalPriceDto } from 'src/common/product.dto';
import { ProductService } from './product.service';

@Controller('aresa-api')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('initialize')
  async createProduct(): Promise<any> {
    return await this.productService.initializeProducts();
  }

  @Get('historical_price/:aptId/:year')
  async getHistoricalPrice(
    @Param('aptId') aptId: number,
    @Param('year') year: number,
  ) {
    return await this.productService.getHistoricalPrice(aptId, year);
  }

  @Post('historical_price')
  async setHistoricalPrice(@Body() data: HistoricalPriceDto) {
    return await this.productService.setHistoricalPrice(data);
  }

  @Get('future_price/:aptId/:year')
  async getFuturePrice(
    @Param('aptId') aptId: number,
    @Param('year') year: number,
  ) {
    return await this.productService.getFuturePrice(aptId, year);
  }

  @Post('future_price')
  async setFuturePrice(@Body() data: FuturePriceDto) {
    return await this.productService.setFuturePrice(data);
  }
}

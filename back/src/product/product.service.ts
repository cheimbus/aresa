import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/Product';
import { Repository } from 'typeorm';
import dataSource from 'datasource';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async initializeProducts(): Promise<void> {
    for (let year = 2000; year <= 2033; year++) {
      const product = new Product();
      product.aptId = 1101105;
      product.year = year;
      product.monthStart = 1;
      product.monthEnd = 12;
      product.value = JSON.stringify(
        Array(product.monthEnd - product.monthStart + 1).fill(0),
      );

      try {
        await this.productRepository.query(
          'INSERT INTO products (apt_id, year, month_start, month_end, value) VALUES (DEFAULT, ?, ?, ?, ?)',
          [product.year, product.monthStart, product.monthEnd, product.value],
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  async getHistoricalPrice(data) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    const product = await queryRunner.manager
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.apt_id=:aptId', { aptId: data.data.aptId })
      .andWhere('product.year=:year', { year: data.data.year })
      .getOne();
    if (year > data.data.year) {
      return JSON.parse(product.value);
    } else if (year === data.data.year) {
      return JSON.parse(product.value).slice(0, month);
    }
  }
}

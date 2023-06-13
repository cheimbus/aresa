import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/Product';
import { Repository } from 'typeorm';
import dataSource from 'datasource';
import { FuturePriceDto, HistoricalPriceDto } from 'src/common/product.dto';

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
      product.value = JSON.stringify(Array(12).fill(0));

      try {
        await this.productRepository.query(
          'INSERT INTO products (id, apt_id, year, value) VALUES (DEFAULT,?, ?, ?)',
          [product.aptId, product.year, product.value],
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  async getHistoricalPrice(data: HistoricalPriceDto) {
    const now = new Date();
    const year = now.getFullYear();
    if (year < data.year) throw new BadRequestException('잘못된 요청입니다.');
    const month = now.getMonth() + 1;
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    const product = await queryRunner.manager
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.apt_id=:aptId', { aptId: data.aptId })
      .andWhere('product.year=:year', { year: data.year })
      .getOne();
    if (year > data.year) {
      return JSON.parse(product.value);
    } else if (year === data.year) {
      return JSON.parse(product.value).slice(0, month);
    } else {
      throw new BadRequestException('잘못된 요청입니다.');
    }
  }

  async setHistoricalPrice(data: HistoricalPriceDto) {
    const now = new Date();
    const month = now.getMonth() + 1;
    if (month < data.monthStart)
      throw new BadRequestException('잘못된 요청입니다.');
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const product = await queryRunner.manager
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.apt_id=:aptId', { aptId: data.aptId })
      .andWhere('product.year=:year', { year: data.year })
      .getOne();

    const parsedValue = JSON.parse(product.value);
    parsedValue[data.monthStart - 1] = data.value;
    try {
      await dataSource
        .createQueryBuilder()
        .update(Product)
        .set({ value: JSON.stringify(parsedValue) })
        .where('apt_id = :aptId', { aptId: data.aptId })
        .andWhere('year = :year', { year: data.year })
        .execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getFuturePrice(data: FuturePriceDto) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    if (year > data.year) throw new BadRequestException('잘못된 요청입니다.');
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    const product = await queryRunner.manager
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.apt_id=:aptId', { aptId: data.aptId })
      .andWhere('product.year=:year', { year: data.year })
      .getOne();
    if (year < data.year) {
      return JSON.parse(product.value);
    } else if (year === data.year) {
      return JSON.parse(product.value).slice(month, 12);
    } else {
      throw new BadRequestException('잘못된 요청입니다.');
    }
  }

  async setFuturePrice(data: FuturePriceDto) {
    const now = new Date();
    const month = now.getMonth() + 1;
    if (month >= data.monthStart)
      throw new BadRequestException('잘못된 요청입니다.');
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const product = await queryRunner.manager
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.apt_id=:aptId', { aptId: data.aptId })
      .andWhere('product.year=:year', { year: data.year })
      .getOne();

    const parsedValue = JSON.parse(product.value);
    parsedValue[data.monthStart - 1] = data.value;
    try {
      await dataSource
        .createQueryBuilder()
        .update(Product)
        .set({ value: JSON.stringify(parsedValue) })
        .where('apt_id = :aptId', { aptId: data.aptId })
        .andWhere('year = :year', { year: data.year })
        .execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

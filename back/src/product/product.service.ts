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

  async initializeProducts() {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await queryRunner.manager
        .getRepository(Product)
        .createQueryBuilder('product')
        .where('product.id=:id', { id: 1 })
        .getOne();
      if (!product) {
        for (let year = 2000; year <= 2033; year++) {
          const product = new Product();
          product.aptId = 1101105;
          product.year = year;
          product.value = JSON.stringify(Array(12).fill(0));
          await this.productRepository.query(
            'INSERT INTO products (id, apt_id, year, value) VALUES (DEFAULT,?, ?, ?)',
            [product.aptId, product.year, product.value],
          );
        }
        return JSON.stringify(Array(12).fill(0));
      } else {
        throw new BadRequestException('이미 생성했습니다');
      }
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getHistoricalPrice(aptId: number, year: number) {
    const now = new Date();
    const currentYear = now.getFullYear();
    if (currentYear < year) throw new BadRequestException('잘못된 요청입니다.');
    const month = now.getMonth() + 1;
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    const product = await queryRunner.manager
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.apt_id=:aptId', { aptId })
      .andWhere('product.year=:year', { year })
      .getOne();
    if (currentYear >= year) {
      return JSON.parse(product.value);
    } else if (currentYear === year) {
      return JSON.parse(product.value).slice(0, month);
    } else {
      throw new BadRequestException('잘못된 요청입니다.');
    }
  }

  async setHistoricalPrice(data: HistoricalPriceDto) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .where('product.aptId = :aptId', { aptId: +data.aptId })
        .andWhere('product.year = :year', { year: +data.year })
        .getOne();

      const parsedValue = JSON.parse(product.value);
      parsedValue[data.monthStart - 1] = +data.value;

      await this.productRepository
        .createQueryBuilder()
        .update(Product)
        .set({ value: JSON.stringify(parsedValue) })
        .where('aptId = :aptId', { aptId: +data.aptId })
        .andWhere('year = :year', { year: +data.year })
        .execute();

      const currentProduct = await this.productRepository
        .createQueryBuilder('product')
        .where('product.aptId = :aptId', { aptId: +data.aptId })
        .andWhere('product.year = :year', { year: +data.year })
        .getOne();
      await queryRunner.commitTransaction();
      return JSON.parse(currentProduct.value);
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getFuturePrice(aptId: number, year: number) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const month = now.getMonth() + 1;
    if (currentYear > year) throw new BadRequestException('잘못된 요청입니다.');
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    const product = await queryRunner.manager
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.apt_id=:aptId', { aptId })
      .andWhere('product.year=:year', { year })
      .getOne();
    if (currentYear <= year) {
      return JSON.parse(product.value);
    } else if (currentYear === year) {
      return JSON.parse(product.value).slice(month, 12);
    } else {
      throw new BadRequestException('잘못된 요청입니다.');
    }
  }

  async setFuturePrice(data: FuturePriceDto) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .where('product.aptId = :aptId', { aptId: data.aptId })
        .andWhere('product.year = :year', { year: data.year })
        .getOne();

      const parsedValue = JSON.parse(product.value);
      parsedValue[data.monthStart - 1] = data.value;

      await this.productRepository
        .createQueryBuilder()
        .update(Product)
        .set({ value: JSON.stringify(parsedValue) })
        .where('aptId = :aptId', { aptId: data.aptId })
        .andWhere('year = :year', { year: data.year })
        .execute();
      const currentProduct = await this.productRepository
        .createQueryBuilder('product')
        .where('product.aptId = :aptId', { aptId: +data.aptId })
        .andWhere('product.year = :year', { year: +data.year })
        .getOne();
      await queryRunner.commitTransaction();
      return JSON.parse(currentProduct.value);
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

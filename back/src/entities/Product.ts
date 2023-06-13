import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', name: 'apt_id' })
  aptId: number;

  @Column({ type: 'int', name: 'year' })
  year: number;

  @Column({ type: 'int', name: 'month_start' })
  monthStart: number;

  @Column({ type: 'int', name: 'month_end' })
  monthEnd: number;

  @Column({ type: 'int', name: 'value' })
  value: number[];
}

/**
 * type GetHisotricalPriceRequest = {
    aptId: number; // 아파트 아이디
    year: number; // 과거 시세 조회 년도
    monthStart: number; // 과거 시세 조회 시작 월 (결과값 포함)
    monthEnd: number; // 과거 시세 조회 종료 월 (결과값 포함)
}

type GetHistoricalPriceResponse = {
    value: number[]; // 시작 월 부터 종료 월 까지의 과거 가격
}

type SetHisotricalPriceRequest = {
    aptId: number; // 아파트 아이디
    year: number; // 과거 시세 조회 년도
    monthStart: number; // 과거 시세 입력 시작 월 (결과값 포함)
    values: number[], // 과거 시세 입력 값
}
 */

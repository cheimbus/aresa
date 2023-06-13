import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'apt_id' })
  aptId: number;

  @Column({ type: 'int', name: 'year' })
  year: number;

  @Column({ type: 'text', name: 'value' })
  value: string;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  idOrden: string;

  @Column()
  idProducto: string;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ nullable: true })
  idUsuario: number;

  @Column({ default: 'PENDING' })
  estado: string; // PENDING, COMPLETED, CANCELLED

  @CreateDateColumn()
  fechaOrden: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

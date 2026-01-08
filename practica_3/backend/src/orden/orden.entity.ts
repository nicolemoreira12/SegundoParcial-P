import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from '../producto/producto.entity';

@Entity('ordenes')
export class Orden {
    @PrimaryGeneratedColumn('uuid')
    idOrden: string;

    @Column()
    idProducto: string;

    @ManyToOne(() => Producto, producto => producto.ordenes)
    @JoinColumn({ name: 'idProducto' })
    producto: Producto;

    @Column({ type: 'int' })
    cantidad: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ nullable: true })
    nombreCliente: string;

    @Column({ nullable: true })
    emailCliente: string;

    @Column({ default: 'PENDING' })
    estado: string; // PENDING, COMPLETED, CANCELLED

    @CreateDateColumn()
    fechaOrden: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

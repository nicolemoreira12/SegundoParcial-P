import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Orden } from '../orden/orden.entity';

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn('uuid')
    idProducto: string;

    @Column()
    nombreProducto: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ nullable: true })
    imagenURL: string;

    @Column({ nullable: true })
    idCategoria: number;

    @Column({ default: true })
    disponible: boolean;

    @OneToMany(() => Orden, orden => orden.producto)
    ordenes: Orden[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

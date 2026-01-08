import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto, UpdateProductoDto } from './producto.dto';

@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(Producto)
        private productoRepository: Repository<Producto>,
    ) { }

    async findAll(): Promise<Producto[]> {
        return this.productoRepository.find({
            relations: ['ordenes'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Producto> {
        const producto = await this.productoRepository.findOne({
            where: { idProducto: id },
            relations: ['ordenes'],
        });

        if (!producto) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        return producto;
    }

    async searchByName(nombre: string): Promise<Producto[]> {
        return this.productoRepository.find({
            where: { nombreProducto: Like(`%${nombre}%`) },
            relations: ['ordenes'],
        });
    }

    async create(createProductoDto: CreateProductoDto): Promise<Producto> {
        const producto = this.productoRepository.create(createProductoDto);
        return this.productoRepository.save(producto);
    }

    async update(id: string, updateProductoDto: UpdateProductoDto): Promise<Producto> {
        const producto = await this.findOne(id);

        Object.assign(producto, updateProductoDto);

        return this.productoRepository.save(producto);
    }

    async remove(id: string): Promise<void> {
        const producto = await this.findOne(id);
        await this.productoRepository.remove(producto);
    }

    async updateStock(id: string, cantidad: number): Promise<Producto> {
        const producto = await this.findOne(id);

        if (producto.stock < cantidad) {
            throw new Error(`Stock insuficiente. Disponible: ${producto.stock}, Solicitado: ${cantidad}`);
        }

        producto.stock -= cantidad;
        return this.productoRepository.save(producto);
    }
}

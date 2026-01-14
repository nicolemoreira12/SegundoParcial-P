import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto, UpdateProductoDto } from './producto.dto';
import { WebhookEmitterService } from '../common/webhook-emitter.service';

@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(Producto)
        private productoRepository: Repository<Producto>,
        private webhookEmitter: WebhookEmitterService,
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
        const productoGuardado = await this.productoRepository.save(producto);

        // NUEVO: Emitir evento a n8n
        await this.webhookEmitter.emit('producto.creado', {
            producto: productoGuardado,
            accion: 'crear',
            mensaje: `Nuevo producto creado: ${productoGuardado.nombreProducto}`,
        });

        return productoGuardado;
    }

    async update(id: string, updateProductoDto: UpdateProductoDto): Promise<Producto> {
        const producto = await this.findOne(id);
        const stockAnterior = producto.stock;

        Object.assign(producto, updateProductoDto);
        const productoActualizado = await this.productoRepository.save(producto);

        // NUEVO: Emitir evento a n8n
        await this.webhookEmitter.emit('producto.actualizado', {
            producto: productoActualizado,
            accion: 'actualizar',
            mensaje: `Producto actualizado: ${productoActualizado.nombreProducto}`,
        });

        // NUEVO: Verificar si hay stock bajo después de la actualización
        if (this.webhookEmitter.isStockBajo(productoActualizado.stock)) {
            await this.webhookEmitter.emit('producto.stock_bajo', {
                producto: productoActualizado,
                stockAnterior,
                stockActual: productoActualizado.stock,
                nivelUrgencia: this.webhookEmitter.getNivelUrgencia(productoActualizado.stock),
                mensaje: `⚠️ Stock bajo para: ${productoActualizado.nombreProducto} (Stock: ${productoActualizado.stock})`,
            });
        }

        return productoActualizado;
    }

    async remove(id: string): Promise<void> {
        const producto = await this.findOne(id);
        const nombreProducto = producto.nombreProducto;
        
        await this.productoRepository.remove(producto);

        // NUEVO: Emitir evento a n8n
        await this.webhookEmitter.emit('producto.eliminado', {
            idProducto: id,
            nombreProducto,
            accion: 'eliminar',
            mensaje: `Producto eliminado: ${nombreProducto}`,
        });
    }

    async updateStock(id: string, cantidad: number): Promise<Producto> {
        const producto = await this.findOne(id);

        if (producto.stock < cantidad) {
            throw new Error(`Stock insuficiente. Disponible: ${producto.stock}, Solicitado: ${cantidad}`);
        }

        const stockAnterior = producto.stock;
        producto.stock -= cantidad;
        const productoActualizado = await this.productoRepository.save(producto);

        // NUEVO: Verificar si hay stock bajo después de reducir
        if (this.webhookEmitter.isStockBajo(productoActualizado.stock)) {
            await this.webhookEmitter.emit('producto.stock_bajo', {
                producto: productoActualizado,
                stockAnterior,
                stockActual: productoActualizado.stock,
                cantidadReducida: cantidad,
                nivelUrgencia: this.webhookEmitter.getNivelUrgencia(productoActualizado.stock),
                mensaje: `⚠️ Stock bajo para: ${productoActualizado.nombreProducto} (Stock: ${productoActualizado.stock})`,
            });
        }

        return productoActualizado;
    }
}

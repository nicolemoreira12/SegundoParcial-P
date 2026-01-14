import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orden } from './orden.entity';
import { CreateOrdenDto, UpdateOrdenDto } from './orden.dto';
import { ProductoService } from '../producto/producto.service';
import { WebhookEmitterService } from '../common/webhook-emitter.service';

@Injectable()
export class OrdenService {
    constructor(
        @InjectRepository(Orden)
        private ordenRepository: Repository<Orden>,
        private productoService: ProductoService,
        private webhookEmitter: WebhookEmitterService,
    ) { }

    async findAll(): Promise<Orden[]> {
        return this.ordenRepository.find({
            relations: ['producto'],
            order: { fechaOrden: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Orden> {
        const orden = await this.ordenRepository.findOne({
            where: { idOrden: id },
            relations: ['producto'],
        });

        if (!orden) {
            throw new NotFoundException(`Orden con ID ${id} no encontrada`);
        }

        return orden;
    }

    async create(createOrdenDto: CreateOrdenDto): Promise<Orden> {
        const { idProducto, cantidad } = createOrdenDto;

        // Verificar que el producto existe y tiene stock
        const producto = await this.productoService.findOne(idProducto);

        if (producto.stock < cantidad) {
            throw new BadRequestException(
                `Stock insuficiente. Disponible: ${producto.stock}, Solicitado: ${cantidad}`
            );
        }

        // Calcular total
        const total = producto.precio * cantidad;

        // Crear orden
        const orden = this.ordenRepository.create({
            ...createOrdenDto,
            total,
            estado: 'PENDING',
        });

        const ordenGuardada = await this.ordenRepository.save(orden);

        // Actualizar stock del producto (esto ya emite evento de stock_bajo si aplica)
        await this.productoService.updateStock(idProducto, cantidad);

        // Obtener orden con producto relacionado
        const ordenCompleta = await this.findOne(ordenGuardada.idOrden);

        // NUEVO: Emitir evento a n8n
        await this.webhookEmitter.emit('orden.creada', {
            orden: ordenCompleta,
            producto: producto,
            cliente: {
                nombre: createOrdenDto.nombreCliente || 'No especificado',
                email: createOrdenDto.emailCliente || 'No especificado',
            },
            accion: 'crear',
            mensaje: `Nueva orden creada: ${ordenCompleta.idOrden} - ${producto.nombreProducto} x${cantidad}`,
        });

        return ordenCompleta;
    }

    async update(id: string, updateOrdenDto: UpdateOrdenDto): Promise<Orden> {
        const orden = await this.findOne(id);
        const estadoAnterior = orden.estado;

        Object.assign(orden, updateOrdenDto);
        const ordenActualizada = await this.ordenRepository.save(orden);

        // NUEVO: Emitir evento según el cambio de estado
        if (updateOrdenDto.estado && updateOrdenDto.estado !== estadoAnterior) {
            if (updateOrdenDto.estado === 'CANCELLED') {
                // Evento específico de cancelación (crítico)
                await this.webhookEmitter.emit('orden.cancelada', {
                    orden: ordenActualizada,
                    estadoAnterior,
                    nuevoEstado: updateOrdenDto.estado,
                    nivelUrgencia: 'alta',
                    accion: 'cancelar',
                    mensaje: `⚠️ Orden cancelada: ${id}`,
                });
            } else if (updateOrdenDto.estado === 'COMPLETED') {
                // Evento de orden entregada
                await this.webhookEmitter.emit('orden.entregada', {
                    orden: ordenActualizada,
                    estadoAnterior,
                    nuevoEstado: updateOrdenDto.estado,
                    accion: 'completar',
                    mensaje: `✅ Orden completada: ${id}`,
                });
            } else {
                // Evento genérico de actualización
                await this.webhookEmitter.emit('orden.actualizada', {
                    orden: ordenActualizada,
                    estadoAnterior,
                    nuevoEstado: updateOrdenDto.estado,
                    accion: 'actualizar',
                    mensaje: `Orden actualizada: ${id} (${estadoAnterior} → ${updateOrdenDto.estado})`,
                });
            }
        }

        return ordenActualizada;
    }

    async remove(id: string): Promise<void> {
        const orden = await this.findOne(id);
        await this.ordenRepository.remove(orden);
    }
}

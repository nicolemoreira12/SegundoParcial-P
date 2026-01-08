import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orden } from './orden.entity';
import { CreateOrdenDto, UpdateOrdenDto } from './orden.dto';
import { ProductoService } from '../producto/producto.service';

@Injectable()
export class OrdenService {
    constructor(
        @InjectRepository(Orden)
        private ordenRepository: Repository<Orden>,
        private productoService: ProductoService,
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

        // Actualizar stock del producto
        await this.productoService.updateStock(idProducto, cantidad);

        // Retornar orden con producto relacionado
        return this.findOne(ordenGuardada.idOrden);
    }

    async update(id: string, updateOrdenDto: UpdateOrdenDto): Promise<Orden> {
        const orden = await this.findOne(id);

        Object.assign(orden, updateOrdenDto);

        return this.ordenRepository.save(orden);
    }

    async remove(id: string): Promise<void> {
        const orden = await this.findOne(id);
        await this.ordenRepository.remove(orden);
    }
}

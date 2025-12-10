import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
  ) {}

  /**
   * Crear una nueva orden
   */
  async createOrder(data: {
    idProducto: string;
    cantidad: number;
    total: number;
    idUsuario?: number;
  }): Promise<Order> {
    const order = this.repo.create({
      idProducto: data.idProducto,
      cantidad: data.cantidad,
      total: data.total,
      idUsuario: data.idUsuario,
      estado: 'PENDING',
    });
    
    const savedOrder = await this.repo.save(order);
    console.log(`✅ Orden creada: ${savedOrder.idOrden}`);
    return savedOrder;
  }

  /**
   * Obtener todas las órdenes
   */
  async findAll(): Promise<Order[]> {
    return this.repo.find({
      order: { fechaOrden: 'DESC' },
    });
  }

  /**
   * Buscar orden por ID
   */
  async findById(orderId: string): Promise<Order | null> {
    return this.repo.findOneBy({ idOrden: orderId });
  }

  /**
   * Actualizar estado de la orden
   */
  async updateStatus(orderId: string, estado: string): Promise<void> {
    await this.repo.update({ idOrden: orderId }, { estado });
    console.log(`✅ Estado de orden ${orderId} actualizado a: ${estado}`);
  }
}

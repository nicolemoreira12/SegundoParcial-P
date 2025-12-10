import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Controller('orders')
export class OrderController {
  constructor(
    @Inject('ORDER_PUBLISHER') private readonly orderClient: ClientProxy,
  ) {}

  @Post()
  async createOrder(@Body() body: { 
    idProducto: string; 
    cantidad: number;
    total: number;
    idUsuario?: number;
    message_id?: string; // Permitir message_id personalizado para pruebas de idempotencia
  }) {
    // Usar message_id proporcionado o generar uno nuevo
    const message_id = body.message_id || uuidv4();

    // Publicar evento a RabbitMQ
    this.orderClient.emit('order.request', {
      message_id,
      data: {
        idProducto: body.idProducto,
        cantidad: body.cantidad,
        total: body.total,
        idUsuario: body.idUsuario,
      },
    });

    console.log(`📤 PUBLISHED order.request - message_id: ${message_id}`);
    console.log(`   Producto ID: ${body.idProducto}, Cantidad: ${body.cantidad}, Total: $${body.total}`);

    return { 
      message: 'Order request sent', 
      message_id,
      status: 'pending',
    };
  }
}

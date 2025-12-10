import { Controller, Inject } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  ClientProxy,
} from '@nestjs/microservices';
import { IdempotencyGuard } from '../idempotency/idempotency.guard';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly idempotencyGuard: IdempotencyGuard,
    private readonly orderService: OrderService,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {}

  /**
   * Listener para CREAR órdenes (desde ms-gateway)
   * Evento: order.request
   * 
   * SISTEMA DE IDEMPOTENCIA:
   * 1. Verifica si el message_id ya fue procesado
   * 2. Si es duplicado, ignora el mensaje
   * 3. Si es nuevo, procesa y guarda el message_id
   */
  @EventPattern('order.request')
  async handleOrderRequest(@Payload() payload: any, @Ctx() context: RmqContext) {
    console.log('\n📥 Procesando order.request...');
    console.log(`   Message ID: ${payload.message_id}`);
    console.log(`   Producto ID: ${payload.data.idProducto}, Cantidad: ${payload.data.cantidad}`);

    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      // IDEMPOTENCIA: Ejecutar handler solo si el message_id es nuevo
      await this.idempotencyGuard.run(payload.message_id, async () => {
        // Crear la orden
        const order = await this.orderService.createOrder(payload.data);

        // Emitir evento para actualizar stock del producto
        this.client.emit('order.created', {
          idProducto: payload.data.idProducto,
          cantidad: payload.data.cantidad,
          orderId: order.idOrden,
        });

        console.log('✅ Orden creada y evento emitido a ms-product');
      });

      // Confirmar mensaje (ACK)
      channel.ack(msg);
    } catch (error) {
      console.error('❌ Error procesando orden:', error.message);
      // ACK incluso si falla para evitar reintentos infinitos
      // En producción, usar Dead Letter Queue
      channel.ack(msg);
    }
  }
}

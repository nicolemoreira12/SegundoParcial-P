import { Controller, Inject } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  ClientProxy,
} from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { IdempotencyGuard } from '../idempotency/idempotency.guard';
import { OrderService } from './order.service';
import { WebhookPublisherService } from '../webhook/webhook.publisher.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly idempotencyGuard: IdempotencyGuard,
    private readonly orderService: OrderService,
    private readonly webhookPublisher: WebhookPublisherService,
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

        // 🔔 PUBLICAR WEBHOOK a todos los suscriptores
        await this.webhookPublisher.publishEvent({
          event_id: uuidv4(),
          event_type: 'order.created',
          timestamp: new Date().toISOString(),
          idempotency_key: payload.message_id,
          payload: {
            order_id: order.idOrden,
            product_id: payload.data.idProducto,
            quantity: payload.data.cantidad,
            total: payload.data.total,
            user_id: payload.data.idUsuario,
            status: order.estado,
            created_at: order.fechaOrden,
          },
        });

        console.log('✅ Orden creada, evento emitido y webhook publicado');
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

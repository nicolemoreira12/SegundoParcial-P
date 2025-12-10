import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class ProductConsumer {
  constructor(private readonly productService: ProductService) {}

  /**
   * Listener para CREAR productos (desde ms-gateway)
   * Evento: product.create
   */
  @EventPattern('product.create')
  async handleProductCreate(
    @Payload() payload: {
      message_id: string;
      data: {
        nombreProducto: string;
        descripcion: string;
        precio: number;
        stock: number;
        imagenURL?: string;
        idEmprendedor?: number;
        idCategoria?: number;
      };
    },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log('\n📥 product.create recibido');
      console.log(`   Message ID: ${payload.message_id}`);
      console.log(`   Producto: ${payload.data.nombreProducto}, Precio: $${payload.data.precio}, Stock: ${payload.data.stock}`);

      // Crear con verificación de idempotencia
      const result = await this.productService.create(payload.data);

      if (result.isNew) {
        console.log(`✅ Producto CREADO: ${result.product.idProducto}`);
      } else {
        console.log(`⚠️ Producto YA EXISTÍA: ${result.product.idProducto} (idempotencia aplicada)`);
      }

      // Confirmar mensaje
      channel.ack(originalMsg);
    } catch (error) {
      console.error('❌ Error creando producto:', error.message);
      // ACK del mensaje incluso si falla para evitar reintentos infinitos
      // En producción, podrías usar Dead Letter Queue
      channel.ack(originalMsg);
    }
  }

  /**
   * Listener para ACTUALIZAR stock (desde ms-order cuando se crea una orden)
   * Evento: order.created
   */
  @EventPattern('order.created')
  async handleOrderCreated(
    @Payload() data: {
      idProducto: string;
      cantidad: number;
      orderId: string;
    },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log('\n📥 order.created recibido');
      console.log(`   Orden ID: ${data.orderId}`);
      console.log(`   Producto ID: ${data.idProducto}, Cantidad: ${data.cantidad}`);

      // Actualizar stock del producto
      const success = await this.productService.updateStock(
        data.idProducto,
        data.cantidad,
      );

      if (success) {
        console.log('✅ Stock actualizado exitosamente');
      } else {
        console.log('⚠️ No se pudo actualizar el stock (producto no encontrado o stock insuficiente)');
      }

      channel.ack(originalMsg);
    } catch (error) {
      console.error('❌ Error actualizando stock:', error.message);
      channel.ack(originalMsg);
    }
  }
}

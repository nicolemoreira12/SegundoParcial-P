import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Controller('products')
export class ProductController {
  constructor(
    @Inject('PRODUCT_PUBLISHER') private readonly productClient: ClientProxy,
  ) {}

  @Post()
  async createProduct(@Body() body: { 
    nombreProducto: string; 
    descripcion: string;
    precio: number; 
    stock: number;
    imagenURL?: string;
    idEmprendedor?: number;
    idCategoria?: number;
  }) {
    const message_id = uuidv4();

    // Publicar evento a RabbitMQ
    this.productClient.emit('product.create', {
      message_id,
      data: body,
    });

    console.log(`📤 PUBLISHED product.create - message_id: ${message_id}`);
    console.log(`   Producto: ${body.nombreProducto}, Precio: $${body.precio}, Stock: ${body.stock}`);

    return { 
      message: 'Product creation request sent', 
      message_id,
      status: 'pending',
    };
  }
}

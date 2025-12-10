import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
  ) {}

  /**
   * Crear producto con idempotencia por nombre
   * Si ya existe un producto con el mismo nombre, lo retorna sin crear duplicado
   */
  async create(data: {
    nombreProducto: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagenURL?: string;
    idEmprendedor?: number;
    idCategoria?: number;
  }): Promise<{ product: Product; isNew: boolean }> {
    // Verificar idempotencia: buscar por nombre
    const existingProduct = await this.repo.findOne({
      where: { nombreProducto: data.nombreProducto },
    });

    if (existingProduct) {
      console.log(`⚠️ Producto ya existe (idempotencia): ${existingProduct.idProducto}`);
      return { product: existingProduct, isNew: false };
    }

    // Si no existe, crear nuevo producto
    const product = this.repo.create(data);
    const savedProduct = await this.repo.save(product);
    console.log(`✅ Nuevo producto creado: ${savedProduct.idProducto}`);
    return { product: savedProduct, isNew: true };
  }

  /**
   * Obtener todos los productos
   */
  async findAll(): Promise<Product[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Actualizar stock del producto (cuando se crea una orden)
   */
  async updateStock(productId: string, cantidad: number): Promise<boolean> {
    const product = await this.repo.findOneBy({ idProducto: productId });
    
    if (!product) {
      console.error(`❌ Producto no encontrado: ${productId}`);
      return false;
    }

    // Verificar si hay suficiente stock
    if (product.stock < cantidad) {
      console.error(`❌ Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${cantidad}`);
      return false;
    }

    // Actualizar stock
    product.stock -= cantidad;
    await this.repo.save(product);
    console.log(`✅ Stock actualizado para producto ${productId}. Nuevo stock: ${product.stock}`);
    return true;
  }

  /**
   * Buscar producto por ID
   */
  async findById(productId: string): Promise<Product | null> {
    return this.repo.findOneBy({ idProducto: productId });
  }
}

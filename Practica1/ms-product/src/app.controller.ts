import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ProductService } from './product/product.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly productService: ProductService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'OK',
      service: 'ms-product',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('products')
  async getProducts() {
    return this.productService.findAll();
  }
}

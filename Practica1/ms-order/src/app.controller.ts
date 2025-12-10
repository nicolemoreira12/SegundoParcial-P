import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderService } from './order/order.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly orderService: OrderService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'OK',
      service: 'ms-order',
      idempotency: 'enabled',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('orders')
  async getOrders() {
    return this.orderService.findAll();
  }
}

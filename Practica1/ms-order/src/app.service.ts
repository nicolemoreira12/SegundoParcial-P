import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'MS-Order - Microservicio de Órdenes con Idempotencia';
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'API Gateway - Sistema de Microservicios con Idempotencia';
  }
}

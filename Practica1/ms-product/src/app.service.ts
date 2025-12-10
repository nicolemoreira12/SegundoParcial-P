import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'MS-Product - Microservicio de Productos';
  }
}

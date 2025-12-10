import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS si es necesario
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
  console.log('🌐 ms-gateway running on port 3000');
  console.log('📡 Publishing events to RabbitMQ...');
}
bootstrap();

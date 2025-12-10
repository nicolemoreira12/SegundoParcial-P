import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Conectar a RabbitMQ para escuchar mensajes
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'order_queue',
      queueOptions: { durable: true },
      noAck: false, // ACK manual para garantizar procesamiento
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3002);
  console.log('📝 ms-order running on port 3002');
  console.log('👂 Listening to order_queue...');
  console.log('🔒 Sistema de idempotencia activado');
}
bootstrap();

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
      queue: 'product_queue',
      queueOptions: { durable: true },
      noAck: false, // ACK manual para garantizar procesamiento
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
  console.log('🐾 ms-product running on port 3001');
  console.log('👂 Listening to product_queue...');
}
bootstrap();

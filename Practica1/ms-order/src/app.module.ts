import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { Order } from './order/order.entity';
import { IdempotencyGuard } from './idempotency/idempotency.guard';
import { IdempotencyService } from './idempotency/idempotency.service';
import { Idempotency } from './idempotency/idempotency.entity';
import { WebhookModule } from './webhook/webhook.module';
import { WebhookSubscription } from './webhook/entities/webhook-subscription.entity';
import { WebhookDelivery } from './webhook/entities/webhook-delivery.entity';
import { WebhookEventEntity } from './webhook/entities/webhook-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'pguser',
      password: 'pgpass',
      database: 'order_db',
      entities: [Order, Idempotency, WebhookSubscription, WebhookDelivery, WebhookEventEntity],
      synchronize: true, // Solo para desarrollo
    }),
    TypeOrmModule.forFeature([Order, Idempotency]),
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'product_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
    WebhookModule,
  ],
  controllers: [AppController, OrderController],
  providers: [AppService, OrderService, IdempotencyGuard, IdempotencyService],
})
export class AppModule {}

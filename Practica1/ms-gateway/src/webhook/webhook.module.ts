import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookController } from './webhook.controller';
import { WebhookSubscription } from './entities/webhook-subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'pguser',
      password: 'pgpass',
      database: 'order_db',
      entities: [WebhookSubscription],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([WebhookSubscription]),
  ],
  controllers: [WebhookController],
})
export class WebhookModule {}

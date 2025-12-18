import { Controller, Post, Get, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { WebhookSubscription } from './dto/webhook-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookSubscription as WebhookSubscriptionEntity } from './entities/webhook-subscription.entity';

@Controller('webhook-subscriptions')
export class WebhookController {
  constructor(
    @InjectRepository(WebhookSubscriptionEntity)
    private readonly subscriptionRepo: Repository<WebhookSubscriptionEntity>,
  ) {}

  @Post()
  @HttpCode(201)
  async createSubscription(@Body() dto: WebhookSubscription) {
    const subscription = await this.subscriptionRepo.save({
      url: dto.url,
      event_type: dto.event_type,
      secret: dto.secret,
      active: dto.active ?? true,
    });

    console.log(`✅ Suscripción creada: ${subscription.id} para ${subscription.event_type}`);

    return {
      message: 'Webhook subscription created',
      subscription: {
        id: subscription.id,
        url: subscription.url,
        event_type: subscription.event_type,
        active: subscription.active,
        created_at: subscription.created_at,
      },
    };
  }

  @Get()
  async listSubscriptions() {
    const subscriptions = await this.subscriptionRepo.find({
      order: { created_at: 'DESC' },
    });

    return {
      count: subscriptions.length,
      subscriptions: subscriptions.map(s => ({
        id: s.id,
        url: s.url,
        event_type: s.event_type,
        active: s.active,
        created_at: s.created_at,
      })),
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteSubscription(@Param('id') id: string) {
    const result = await this.subscriptionRepo.delete(id);

    if (result.affected === 0) {
      return {
        success: false,
        message: 'Subscription not found',
      };
    }

    console.log(`🗑️ Suscripción eliminada: ${id}`);

    return {
      success: true,
      message: 'Webhook subscription deleted',
    };
  }

  @Get('events')
  async getWebhookEvents() {
    // Aquí podrías consultar la tabla webhook_events en ms-order
    // Por ahora retornamos información básica
    return {
      message: 'Query webhook_events table in ms-order database for full audit trail',
      available_event_types: ['order.created', 'product.created'],
    };
  }
}

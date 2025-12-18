import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { WebhookEvent } from './webhook-event.interface';
import { WebhookSubscription } from './entities/webhook-subscription.entity';
import { WebhookDelivery } from './entities/webhook-delivery.entity';
import { WebhookEventEntity } from './entities/webhook-event.entity';

/**
 * Servicio que maneja la publicación de webhooks
 * 
 * RESPONSABILIDADES:
 * 1. Guardar el evento en la BD
 * 2. Buscar suscriptores activos
 * 3. Enviar webhook a cada suscriptor
 * 4. Manejar reintentos con backoff exponencial
 * 5. Enviar a DLQ si falla después de 6 intentos
 */
@Injectable()
export class WebhookPublisherService {
  constructor(
    @InjectRepository(WebhookSubscription)
    private subscriptionRepo: Repository<WebhookSubscription>,
    
    @InjectRepository(WebhookDelivery)
    private deliveryRepo: Repository<WebhookDelivery>,
    
    @InjectRepository(WebhookEventEntity)
    private eventRepo: Repository<WebhookEventEntity>,
    
    @Inject('WEBHOOK_CLIENT')
    private rabbitClient: ClientProxy,
    
    private configService: ConfigService,
  ) {}

  async publishEvent(event: WebhookEvent): Promise<void> {
    const logData = {
      timestamp: new Date().toISOString(),
      level: 'info',
      microservice: 'ms-order',
      event_type: event.event_type,
      event_id: event.event_id,
      correlation_id: event.idempotency_key,
      status: 'publishing',
      message: 'Publicando webhook',
    };
    console.log(JSON.stringify(logData));

    await this.saveEvent(event);

    const subscriptions = await this.subscriptionRepo.find({
      where: {
        event_type: event.event_type,
        active: true,
      },
    });

    console.log(JSON.stringify({
      ...logData,
      status: 'subscriptions_found',
      message: `${subscriptions.length} suscriptores encontrados`,
    }));

    for (const subscription of subscriptions) {
      await this.sendWebhook(subscription, event, 1);
    }
  }

  private async saveEvent(event: WebhookEvent): Promise<void> {
    await this.eventRepo.save({
      event_id: event.event_id,
      event_type: event.event_type,
      payload: event.payload,
    });
  }

  private async sendWebhook(
    subscription: WebhookSubscription,
    event: WebhookEvent,
    attempt: number,
  ): Promise<void> {
    const logData = {
      timestamp: new Date().toISOString(),
      level: 'info',
      microservice: 'ms-order',
      event_type: event.event_type,
      event_id: event.event_id,
      correlation_id: event.idempotency_key,
      attempt,
      subscription_id: subscription.id,
      subscription_url: subscription.url,
    };

    console.log(JSON.stringify({
      ...logData,
      status: 'sending',
      message: `Intento ${attempt}/6 para suscripción ${subscription.id}`,
    }));

    const delivery = new WebhookDelivery();
    delivery.subscription_id = subscription.id;
    delivery.event_id = event.event_id;
    delivery.attempt_number = attempt;
    delivery.status = 'pending';
    await this.deliveryRepo.save(delivery);

    try {
      // Generar firma HMAC-SHA256
      const signature = this.generateSignature(event, subscription.secret);

      const anonKey = this.configService.get('SUPABASE_ANON_KEY');

      // Enviar POST HTTP con headers de seguridad
      const response = await axios.post(subscription.url, event, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
          'X-Signature': signature,
          'X-Timestamp': event.timestamp,
          'X-Event-Id': event.event_id,
        },
        timeout: 5000, // 5 segundos máximo
      });

      // Actualizar como exitoso
      delivery.status = 'delivered';
      delivery.response_status = response.status;
      delivery.delivered_at = new Date();
      await this.deliveryRepo.save(delivery);

      console.log(JSON.stringify({
        ...logData,
        level: 'info',
        status: 'delivered',
        response_status: response.status,
        message: 'Webhook entregado exitosamente',
      }));

    } catch (error) {
      // Manejar error
      console.log(JSON.stringify({
        ...logData,
        level: 'error',
        status: 'failed',
        message: `Error enviando webhook: ${error.message}`,
      }));

      delivery.status = 'failed';
      delivery.error_message = error.message;
      await this.deliveryRepo.save(delivery);

      // Decidir si reintentar o enviar a DLQ
      if (attempt < 6) {
        const delay = Math.pow(2, attempt) * 1000;
        
        console.log(JSON.stringify({
          ...logData,
          status: 'retry_scheduled',
          message: `Reintentando en ${delay / 1000}s...`,
        }));

        setTimeout(() => {
          this.sendWebhook(subscription, event, attempt + 1);
        }, delay);

      } else {
        console.log(JSON.stringify({
          ...logData,
          level: 'error',
          status: 'dlq',
          message: 'Máximo de reintentos alcanzado, enviando a DLQ',
        }));
        await this.sendToDLQ(event, subscription, error.message);
      }
    }
  }

  private generateSignature(event: WebhookEvent, secret: string): string {
    const payload = JSON.stringify(event);
    
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Envía evento a Dead Letter Queue
   * Permite análisis posterior y reenvío manual
   */
  private async sendToDLQ(
    event: WebhookEvent,
    subscription: WebhookSubscription,
    errorMessage: string,
  ): Promise<void> {
    this.rabbitClient.emit('webhook.dlq', {
      event,
      subscription_id: subscription.id,
      subscription_url: subscription.url,
      reason: 'max_retries_exceeded',
      last_error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}

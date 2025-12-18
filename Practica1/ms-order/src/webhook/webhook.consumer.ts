import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { WebhookPublisherService } from './webhook.publisher.service';
import type { OrderCreatedEvent } from '../events/order-created.event';

@Controller()
export class WebhookConsumer {
  constructor(
    private readonly webhookPublisher: WebhookPublisherService,
  ) {}

  @EventPattern('webhook.publish')
  async handleWebhookPublish(
    @Payload() event: OrderCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    const logData = {
      timestamp: new Date().toISOString(),
      level: 'info',
      microservice: 'ms-order',
      event_type: event.event_type,
      event_id: event.event_id,
      correlation_id: event.idempotency_key,
      status: 'received',
      message: 'Evento recibido para webhook',
    };
    console.log(JSON.stringify(logData));

    try {
      await this.webhookPublisher.publishEvent(event);

      channel.ack(msg);
      
      console.log(JSON.stringify({
        ...logData,
        status: 'processed',
        message: 'Webhook procesado correctamente',
      }));

    } catch (error) {
      console.log(JSON.stringify({
        ...logData,
        level: 'error',
        status: 'error',
        message: `Error procesando webhook: ${error.message}`,
      }));

      channel.ack(msg);
    }
  }
}

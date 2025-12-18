import { WebhookEvent } from '../webhook/webhook-event.interface';

export interface OrderCreatedEvent extends WebhookEvent {
  event_type: 'order.created';
  payload: {
    order_id: string;
    product_id: string;
    quantity: number;
    total: number;
    created_at: string;
  };
}

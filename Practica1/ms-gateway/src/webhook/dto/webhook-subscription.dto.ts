export class WebhookSubscription {
  url: string;
  event_type: string;
  secret: string;
  active?: boolean;
}

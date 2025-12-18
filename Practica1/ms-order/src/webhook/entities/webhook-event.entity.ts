import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('webhook_events')
export class WebhookEventEntity {
  @PrimaryColumn({ type: 'text' })
  event_id: string;

  @Column({ type: 'text' })
  event_type: string;

  @Column({ type: 'jsonb' })
  payload: any;

  @CreateDateColumn()
  created_at: Date;
}

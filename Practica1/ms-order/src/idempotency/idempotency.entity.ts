import { Entity, PrimaryColumn, Column } from 'typeorm';

/**
 * Tabla de control de idempotencia
 * Almacena los message_id procesados para evitar duplicados
 * 
 * Estrategia: Idempotent Consumer Pattern
 * - Si el message_id ya existe, el mensaje es duplicado
 * - Si es nuevo, se procesa y se guarda en esta tabla
 */
@Entity('idempotency')
export class Idempotency {
  @PrimaryColumn('uuid')
  message_id: string;

  @Column()
  consumer: string; // Nombre del consumidor (ms-order)

  @Column({ type: 'timestamptz', default: () => 'now()' })
  processed_at: Date;

  @Column({ type: 'text', nullable: true })
  metadata: string; // Info adicional del mensaje procesado
}

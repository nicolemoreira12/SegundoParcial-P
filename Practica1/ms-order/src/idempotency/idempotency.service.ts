import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idempotency } from './idempotency.entity';

/**
 * Servicio de Idempotencia
 * 
 * PROPÓSITO:
 * Implementar deduplicación estricta usando claves de idempotencia
 * almacenadas en una tabla de control PostgreSQL.
 * 
 * EL PROBLEMA:
 * RabbitMQ garantiza "At-least-once delivery". Si la red falla antes del ACK,
 * el mensaje se duplica. Procesar una orden dos veces puede ser catastrófico.
 * 
 * LA SOLUCIÓN:
 * Usar una tabla de control con UNIQUE constraint en message_id.
 * Si el INSERT falla por duplicado, sabemos que ya fue procesado.
 */
@Injectable()
export class IdempotencyService {
  constructor(
    @InjectRepository(Idempotency)
    private repo: Repository<Idempotency>,
  ) {}

  /**
   * Intenta registrar un message_id como procesado
   * 
   * @param messageId - UUID único del mensaje
   * @returns true si es nuevo (debe procesarse), false si es duplicado (ignorar)
   */
  async tryRegister(messageId: string): Promise<boolean> {
    try {
      // Intentar insertar el message_id
      await this.repo.insert({
        message_id: messageId,
        consumer: 'ms-order',
        metadata: JSON.stringify({ timestamp: new Date().toISOString() }),
      });

      console.log(`🔒 [IDEMPOTENCY] Message ID registrado: ${messageId}`);
      return true; // Es nuevo, debe procesarse
    } catch (err) {
      // Si falla por UNIQUE constraint, es duplicado
      if (err.code === '23505') { // PostgreSQL unique violation
        console.log(`⚠️ [IDEMPOTENCY] Mensaje duplicado detectado: ${messageId}`);
        return false; // Ya fue procesado, ignorar
      }
      // Si es otro error, lanzarlo
      throw err;
    }
  }

  /**
   * Verifica si un message_id ya fue procesado
   * 
   * @param messageId - UUID del mensaje
   * @returns true si ya fue procesado
   */
  async isProcessed(messageId: string): Promise<boolean> {
    const record = await this.repo.findOne({
      where: { message_id: messageId },
    });
    return record !== null;
  }

  /**
   * Obtener todos los mensajes procesados (para auditoría)
   */
  async getAllProcessed(): Promise<Idempotency[]> {
    return this.repo.find({
      order: { processed_at: 'DESC' },
      take: 100, // Últimos 100
    });
  }

  /**
   * Limpiar registros antiguos (opcional, para mantenimiento)
   * 
   * @param daysOld - Eliminar registros más antiguos que X días
   */
  async cleanOldRecords(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.repo
      .createQueryBuilder()
      .delete()
      .where('processed_at < :cutoffDate', { cutoffDate })
      .execute();

    console.log(`🧹 Limpieza: ${result.affected} registros eliminados`);
    return result.affected || 0;
  }
}

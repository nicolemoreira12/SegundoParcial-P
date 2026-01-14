import { Injectable, Logger } from '@nestjs/common';

/**
 * Servicio Emisor de Webhooks para n8n
 * 
 * Este servicio envía eventos HTTP a n8n cuando ocurren operaciones importantes
 * en el sistema. Es independiente y no afecta la lógica existente del backend.
 * 
 * Eventos soportados:
 * - producto.creado: Cuando se crea un nuevo producto
 * - producto.actualizado: Cuando se actualiza un producto
 * - producto.eliminado: Cuando se elimina un producto
 * - producto.stock_bajo: Cuando el stock de un producto es bajo (<5)
 * - orden.creada: Cuando se crea una nueva orden
 * - orden.actualizada: Cuando se actualiza el estado de una orden
 * - orden.cancelada: Cuando se cancela una orden
 */
@Injectable()
export class WebhookEmitterService {
    private readonly logger = new Logger(WebhookEmitterService.name);
    private readonly n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    /**
     * Emite un evento webhook a n8n
     * @param evento Nombre del evento (ej: 'producto.creado', 'orden.creada')
     * @param payload Datos asociados al evento
     */
    async emit(evento: string, payload: any): Promise<void> {
        if (!this.n8nWebhookUrl) {
            this.logger.warn('⚠️ N8N_WEBHOOK_URL no está configurada. Evento no emitido.');
            return;
        }

        try {
            const response = await fetch(this.n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    evento,
                    timestamp: new Date().toISOString(),
                    data: payload,
                }),
            });

            if (response.ok) {
                this.logger.log(`✅ Evento ${evento} emitido a n8n exitosamente`);
            } else {
                this.logger.warn(`⚠️ n8n respondió con status: ${response.status}`);
            }
        } catch (error) {
            // No lanzamos el error para no afectar la operación principal
            this.logger.warn(`⚠️ Error emitiendo webhook: ${error.message}`);
        }
    }

    /**
     * Verifica si un producto tiene stock bajo
     * @param stock Cantidad actual de stock
     * @param umbral Umbral mínimo (default: 5)
     */
    isStockBajo(stock: number, umbral: number = 5): boolean {
        return stock <= umbral;
    }

    /**
     * Determina el nivel de urgencia basado en el stock
     * @param stock Cantidad actual de stock
     */
    getNivelUrgencia(stock: number): 'alta' | 'media' | 'baja' {
        if (stock === 0) return 'alta';
        if (stock <= 5) return 'media';
        return 'baja';
    }
}

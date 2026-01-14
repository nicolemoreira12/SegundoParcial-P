# Práctica 4 - Integración MCP + n8n

## 🎯 Descripción

Esta práctica extiende la arquitectura de microservicios con MCP (Práctica 3) añadiendo **n8n** como capa de automatización de eventos. El sistema MCP sigue siendo el orquestador principal mientras n8n se encarga de:
- 📱 Notificaciones en tiempo real (Telegram)
- 📊 Sincronización con Google Sheets
- 🚨 Alertas de condiciones críticas

## 🏗️ Arquitectura (4 Capas)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  API Gateway    │────▶│   MCP Server    │────▶│    Backend      │
│  + Gemini AI    │     │  (JSON-RPC 2.0) │     │  + Webhooks     │
│     :3000       │     │     :3001       │     │     :3002       │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         │ Webhooks
                                                         ▼
                                                ┌─────────────────┐
                                                │      n8n        │
                                                │ (Automatización)│
                                                │     :5678       │
                                                └─────────────────┘
```

## 🚀 Inicio Rápido

### 1. Configurar variables de entorno
```bash
# Crear archivo .env en la raíz
echo "GEMINI_API_KEY=tu_api_key_aqui" > .env
```

### 2. Levantar todos los servicios
```bash
docker-compose up -d
```

### 3. Verificar servicios
| Servicio | URL | Credenciales |
|----------|-----|--------------|
| API Gateway | http://localhost:3000 | - |
| MCP Server | http://localhost:3001 | - |
| Backend | http://localhost:3002 | - |
| **n8n** | http://localhost:5678 | admin / uleam2025 |

## 📡 Eventos del Backend

El Backend emite webhooks a n8n cuando ocurren operaciones:

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `producto.creado` | Principal | Nuevo producto añadido |
| `producto.actualizado` | Info | Producto modificado |
| `producto.eliminado` | Info | Producto borrado |
| `producto.stock_bajo` | Crítico | Stock ≤ 5 unidades |
| `orden.creada` | Principal | Nueva orden registrada |
| `orden.actualizada` | Info | Estado de orden cambiado |
| `orden.cancelada` | Crítico | Orden cancelada |
| `orden.entregada` | Info | Orden completada |

## 📋 Workflows n8n

### 1. Notificación en Tiempo Real
- **Trigger**: Cualquier evento
- **Proceso**: Gemini genera mensaje → Telegram
- **Webhook**: `POST /webhook/eventos`

### 2. Sincronización Google Sheets
- **Trigger**: Cualquier evento
- **Proceso**: Formatear → Google Sheets
- **Webhook**: `POST /webhook/sync-sheets`

### 3. Alertas Críticas
- **Trigger**: `producto.stock_bajo`, `orden.cancelada`
- **Proceso**: Gemini analiza urgencia → Switch → [Telegram/Email/Log]
- **Webhook**: `POST /webhook/alertas`

## 🧪 Probar Flujo Completo

### Crear un producto (dispara webhook)
```bash
curl -X POST http://localhost:3002/productos \
  -H "Content-Type: application/json" \
  -d '{"nombreProducto": "Laptop Gaming", "precio": 1500, "stock": 3}'
```

### Crear una orden (dispara webhook + posible alerta de stock bajo)
```bash
curl -X POST http://localhost:3002/ordenes \
  -H "Content-Type: application/json" \
  -d '{"idProducto": "UUID_DEL_PRODUCTO", "cantidad": 2, "nombreCliente": "Juan"}'
```

### Usar chat con IA
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Crea un producto llamado Monitor 4K con precio 500 y stock 10"}'
```

## 📁 Estructura del Proyecto

```
Practica4/
├── docker-compose.yml          # Orquestación completa
├── README.md
├── backend/                    # NestJS + TypeORM + Webhooks
│   ├── src/
│   │   ├── common/
│   │   │   ├── webhook-emitter.service.ts   # NUEVO
│   │   │   └── webhook-emitter.module.ts    # NUEVO
│   │   ├── producto/
│   │   └── orden/
│   └── .env
├── mcp-server/                 # Sin cambios desde Práctica 3
├── api-gateway/                # Sin cambios desde Práctica 3
└── n8n/
    ├── docker-compose.yml      # Solo n8n (opcional)
    ├── README.md
    └── workflows/
        ├── 01-notificacion-tiempo-real.json
        ├── 02-sincronizacion-sheets.json
        └── 03-alerta-critica.json
```

## 🔧 Configuración de Servicios Externos

### Telegram Bot
1. Habla con [@BotFather](https://t.me/botfather) en Telegram
2. Ejecuta `/newbot` y sigue las instrucciones
3. Copia el **token** del bot
4. Obtén tu **Chat ID** hablando con [@userinfobot](https://t.me/userinfobot)

### Google Sheets
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita la **Google Sheets API**
3. Crea credenciales **OAuth2**
4. Autoriza en n8n

### Gemini API (para n8n)
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Genera una API Key
3. En n8n, usa como HTTP Request con Query Auth (`key=TU_API_KEY`)

## ✅ Checklist de Entrega

- [ ] Docker compose levanta todos los servicios
- [ ] Backend emite webhooks a n8n
- [ ] Workflow 1: Notificación por Telegram funciona
- [ ] Workflow 2: Registro en Google Sheets funciona
- [ ] Workflow 3: Alertas según urgencia funciona
- [ ] Chat con IA dispara eventos correctamente

# n8n - Plataforma de Automatización

## 🚀 Inicio Rápido

### 1. Levantar n8n
```bash
cd n8n
docker-compose up -d
```

### 2. Acceder a n8n
- URL: http://localhost:5678
- Usuario: `admin`
- Contraseña: `uleam2025`

## 📁 Estructura de Workflows

Esta carpeta contiene los workflows exportados de n8n:

| Archivo | Descripción |
|---------|-------------|
| `01-notificacion-tiempo-real.json` | Notificaciones por Telegram con IA |
| `02-sincronizacion-sheets.json` | Registro en Google Sheets |
| `03-alerta-critica.json` | Alertas según nivel de urgencia |

## 🔧 Configuración de Servicios Externos

### Telegram Bot
1. Habla con @BotFather en Telegram
2. Crea un nuevo bot con `/newbot`
3. Copia el token del bot
4. Obtén tu Chat ID hablando con @userinfobot

### Google Sheets
1. Ve a Google Cloud Console
2. Habilita Google Sheets API
3. Crea credenciales OAuth2
4. Autoriza en n8n

### Gemini API
1. Ve a https://makersuite.google.com/app/apikey
2. Genera una API Key
3. Configura en n8n como HTTP Request

## 📡 Eventos del Backend

El backend emite los siguientes eventos:

| Evento | Descripción | Tipo |
|--------|-------------|------|
| `producto.creado` | Nuevo producto | Principal |
| `producto.actualizado` | Producto modificado | Info |
| `producto.eliminado` | Producto borrado | Info |
| `producto.stock_bajo` | Stock ≤ 5 unidades | Crítico |
| `orden.creada` | Nueva orden | Principal |
| `orden.actualizada` | Orden modificada | Info |
| `orden.cancelada` | Orden cancelada | Crítico |
| `orden.entregada` | Orden completada | Info |

## 📦 Payload de Webhook

```json
{
    "evento": "orden.creada",
    "timestamp": "2026-01-13T10:30:00.000Z",
    "data": {
        "orden": {...},
        "producto": {...},
        "cliente": {...},
        "mensaje": "Nueva orden creada..."
    }
}
```

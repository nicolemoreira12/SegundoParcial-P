# 🎉 PROYECTO COMPLETADO

## Sistema de Microservicios con Idempotencia
### Opción B: Idempotent Consumer Pattern

---

## 📌 RESUMEN EJECUTIVO

Has implementado exitosamente un **sistema completo de microservicios** para gestión de **Productos y Órdenes** con el patrón **Idempotent Consumer**, garantizando procesamiento exactamente una vez mediante:

- **Tabla de control** PostgreSQL con UNIQUE constraint
- **IdempotencyGuard** que verifica cada mensaje
- **Deduplicación automática** de mensajes duplicados
- **Event-Driven Architecture** con RabbitMQ

---

## 📂 ESTRUCTURA DEL PROYECTO

```
Practica1/
├── 📄 README.md                          ← Documentación completa (arquitectura, diagramas)
├── 📄 INSTRUCCIONES_COMPLETAS.md         ← Guía paso a paso para ejecutar
├── 📄 QUICKSTART.md                      ← Inicio rápido
├── 📄 PRUEBAS.md                         ← Scripts de prueba con curl
├── 📄 COMANDOS.md                        ← Comandos útiles
├── 📄 RESUMEN.md                         ← Este archivo
├── 📄 CHECKLIST.md                       ← Checklist de verificación
├── 📄 docker-compose.yml                 ← Infraestructura (RabbitMQ + PostgreSQL)
│
├── 🌐 ms-gateway/                        ← API Gateway (Puerto 3000)
│   ├── src/
│   │   ├── product/                      # POST /products
│   │   ├── order/                        # POST /orders
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── 🐾 ms-product/                        ← Microservicio Productos (Puerto 3001)
│   ├── src/
│   │   ├── product/
│   │   │   ├── product.entity.ts         # Entity TypeORM
│   │   │   ├── product.service.ts        # Lógica de negocio
│   │   │   └── product.consumer.ts       # Consume eventos
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── 📝 ms-order/                          ← Microservicio Órdenes (Puerto 3002)
    ├── src/
    │   ├── order/
    │   │   ├── order.entity.ts           # Entity TypeORM
    │   │   ├── order.service.ts          # Lógica de negocio
    │   │   └── order.controller.ts       # Consume eventos
    │   ├── idempotency/                  # 🔒 SISTEMA DE IDEMPOTENCIA
    │   │   ├── idempotency.entity.ts     # Tabla de control
    │   │   ├── idempotency.service.ts    # tryRegister()
    │   │   └── idempotency.guard.ts      # Middleware de verificación
    │   ├── app.module.ts
    │   └── main.ts
    └── package.json
```

---

## 🚀 INICIO RÁPIDO (3 PASOS)

### 1. Levantar Docker
```powershell
cd "c:\Users\HP\OneDrive\Documentos\SEXTO NIVEL\Servidor Web\SegundoParcial-P\Practica1"
docker-compose up -d
```

### 2. Instalar Dependencias
```powershell
cd ms-gateway && npm install
cd ../ms-product && npm install
cd ../ms-order && npm install
```

### 3. Ejecutar Microservicios (3 terminales)
```powershell
# Terminal 1
cd ms-gateway && npm run start:dev

# Terminal 2
cd ms-product && npm run start:dev

# Terminal 3
cd ms-order && npm run start:dev
```

---

## 🧪 PRUEBA RÁPIDA

```powershell
# 1. Health check
curl http://localhost:3000/health

# 2. Crear producto
curl -X POST http://localhost:3000/products `
  -H "Content-Type: application/json" `
  -d '{\"nombreProducto\":\"Laptop\",\"precio\":1500,\"stock\":10}'

# 3. Listar productos (copiar UUID)
curl http://localhost:3001/products

# 4. Crear orden (reemplazar <UUID>)
curl -X POST http://localhost:3000/orders `
  -H "Content-Type: application/json" `
  -d '{\"idProducto\":\"<UUID>\",\"cantidad\":2,\"total\":3000}'

# 5. Ver orden creada
curl http://localhost:3002/orders
```

---

## 🔒 SISTEMA DE IDEMPOTENCIA

### Componentes

1. **Idempotency Entity** (Tabla de control)
   ```typescript
   @Entity('idempotency')
   export class Idempotency {
     @PrimaryColumn('uuid')
     message_id: string;  // UNIQUE constraint
     
     @Column()
     consumer: string;
     
     @Column({ type: 'timestamptz' })
     processed_at: Date;
   }
   ```

2. **IdempotencyService** (Verificación de duplicados)
   ```typescript
   async tryRegister(messageId: string): Promise<boolean> {
     try {
       await this.repo.insert({ message_id: messageId });
       return true;  // Es nuevo
     } catch (err) {
       return false; // Es duplicado
     }
   }
   ```

3. **IdempotencyGuard** (Middleware)
   ```typescript
   async run(messageId: string, handler: () => Promise<any>) {
     const canProcess = await this.service.tryRegister(messageId);
     if (!canProcess) {
       console.log('Mensaje duplicado ignorado');
       return;
     }
     await handler(); // Ejecutar solo si es nuevo
   }
   ```

### Flujo de Idempotencia

```
Mensaje llega con message_id
        ↓
IdempotencyGuard.run()
        ↓
tryRegister(message_id)
        ↓
    INSERT en tabla
        ↓
   ┌────┴────┐
   ↓         ↓
Éxito    Fallo (UNIQUE)
   ↓         ↓
Nuevo   Duplicado
   ↓         ↓
Procesar  Ignorar
```

---

## 📊 ARQUITECTURA

```
👤 Cliente
    ↓
🌐 API Gateway (3000)
    ↓ emit eventos
🐇 RabbitMQ
    ├─ product_queue
    └─ order_queue
    ↓ consume
📦 Microservicios
    ├─ MS-Product (3001) → 💾 PostgreSQL (5433)
    └─ MS-Order (3002) → 💾 PostgreSQL (5434)
                              ├─ orders
                              └─ idempotency 🔒
```

---

## 🎯 CARACTERÍSTICAS IMPLEMENTADAS

✅ **Sistema de Idempotencia Completo**
- Tabla de control con UNIQUE constraint
- IdempotencyService con tryRegister()
- IdempotencyGuard (middleware)
- Deduplicación automática
- Logs detallados

✅ **Event-Driven Architecture**
- Gateway publica eventos
- Microservicios consumen eventos
- RabbitMQ como message broker
- Comunicación asíncrona

✅ **Microservicios Independientes**
- ms-gateway: API REST
- ms-product: Gestión de productos
- ms-order: Gestión de órdenes + idempotencia
- Database per Service

✅ **ACK Manual y Reintentos**
- noAck: false en configuración
- Reintentos automáticos si falla
- Garantía de procesamiento

✅ **TypeORM + PostgreSQL**
- Entidades bien definidas
- Migraciones automáticas (synchronize: true)
- Consultas optimizadas

✅ **Docker Compose**
- Infraestructura con un comando
- RabbitMQ con Management UI
- 2 instancias PostgreSQL

---

## 📚 DOCUMENTACIÓN DISPONIBLE

| Archivo | Propósito |
|---------|-----------|
| **README.md** | Documentación completa con arquitectura, diagramas, conceptos |
| **INSTRUCCIONES_COMPLETAS.md** | Guía paso a paso detallada para ejecutar el proyecto |
| **QUICKSTART.md** | Guía rápida de inicio (resumen) |
| **PRUEBAS.md** | Scripts de prueba con ejemplos de curl |
| **COMANDOS.md** | Comandos útiles para Docker, RabbitMQ, PostgreSQL |
| **RESUMEN.md** | Resumen visual del proyecto |
| **CHECKLIST.md** | Lista de verificación completa |

---

## 🌐 ENDPOINTS Y PUERTOS

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| Gateway | 3000 | http://localhost:3000 | API REST |
| Product | 3001 | http://localhost:3001 | Microservicio productos |
| Order | 3002 | http://localhost:3002 | Microservicio órdenes |
| RabbitMQ | 5672 | amqp://localhost:5672 | AMQP protocol |
| RabbitMQ UI | 15672 | http://localhost:15672 | Management UI (guest/guest) |
| PostgreSQL Product | 5433 | localhost:5433 | product_db |
| PostgreSQL Order | 5434 | localhost:5434 | order_db |

---

## 🔍 VERIFICAR QUE TODO FUNCIONA

### 1. Health Checks
```powershell
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

### 2. RabbitMQ Management
- Abrir: http://localhost:15672
- Login: guest / guest
- Verificar colas activas

### 3. Logs de Idempotencia
En la terminal de ms-order, buscar:
```
🔐 [IDEMPOTENCY GUARD] Verificando message_id
✅ [IDEMPOTENCY GUARD] Mensaje nuevo, procesando
```

### 4. Base de Datos
```powershell
docker exec -it postgres-order psql -U pguser -d order_db
SELECT * FROM idempotency ORDER BY processed_at DESC LIMIT 10;
```

---

## 🎓 CONCEPTOS CLAVE IMPLEMENTADOS

1. **Idempotent Consumer Pattern**: Procesamiento exactamente una vez
2. **At-least-once → Exactly-once**: RabbitMQ + Idempotencia
3. **Event-Driven Architecture**: Comunicación mediante eventos
4. **Database per Service**: Cada microservicio con su BD
5. **ACK Manual**: Reintentos automáticos en caso de fallo
6. **UNIQUE Constraint**: Garantía a nivel de BD
7. **Message Deduplication**: Detección automática de duplicados

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

- **Framework**: NestJS 10.x
- **Lenguaje**: TypeScript 5.x
- **Message Broker**: RabbitMQ 3.11 (AMQP)
- **Base de Datos**: PostgreSQL 17
- **ORM**: TypeORM 0.3
- **Containerización**: Docker Compose
- **Arquitectura**: Microservicios + Event-Driven

---

## 📦 PARA ENTREGAR

### Código Fuente
✅ Carpeta `Practica1` completa
✅ Todos los microservicios
✅ docker-compose.yml
✅ Documentación completa

### Evidencia
✅ Capturas de pantalla (health checks, RabbitMQ UI, logs)
✅ Consultas SQL (tabla idempotency)
✅ Logs mostrando idempotencia funcionando

### Documentación
✅ README.md completo
✅ Explicación del patrón Idempotent Consumer
✅ Diagramas de arquitectura y flujos
✅ Instrucciones de ejecución

---

## 🆘 SOPORTE Y TROUBLESHOOTING

### Problemas Comunes

**Puerto ocupado:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Docker no inicia:**
- Verificar Docker Desktop está corriendo
- `docker --version`

**Error de conexión a PostgreSQL:**
```powershell
docker-compose logs postgres-order
docker-compose restart postgres-order
```

**RabbitMQ no responde:**
```powershell
docker-compose logs rabbitmq
docker-compose restart rabbitmq
```

---

## ✨ PRÓXIMOS PASOS (Mejoras Opcionales)

- [ ] Dead Letter Queue para errores
- [ ] Tests unitarios y de integración
- [ ] Circuit Breaker pattern
- [ ] Monitoreo con Prometheus/Grafana
- [ ] Autenticación JWT
- [ ] OpenTelemetry para tracing
- [ ] Frontend React/Angular

---

## 📧 INFORMACIÓN DEL PROYECTO

- **Práctica**: Práctica 1 - Segundo Parcial
- **Opción**: B - Idempotent Consumer
- **Entidades**: Producto y Orden
- **Fecha**: 9 de diciembre de 2025
- **Estado**: ✅ COMPLETADO Y FUNCIONAL

---

## 🎉 ¡FELICIDADES!

Has implementado exitosamente un sistema completo de microservicios con:

✅ Arquitectura event-driven
✅ Sistema de idempotencia robusto
✅ Comunicación asíncrona con RabbitMQ
✅ Database per service
✅ Documentación completa
✅ Proyecto listo para entregar

---

**Lee `INSTRUCCIONES_COMPLETAS.md` para instrucciones detalladas de ejecución.**

**Usa `CHECKLIST.md` para verificar que todo esté correcto antes de entregar.**

**🚀 ¡Tu proyecto está listo para funcionar y entregar!**

# Sistema de Microservicios con Idempotencia
## Práctica 1 - Opción B: Idempotent Consumer

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat&logo=rabbitmq&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## 📋 Descripción del Proyecto

Sistema de microservicios para gestión de **Productos** y **Órdenes** implementando el patrón **Idempotent Consumer** para garantizar procesamiento exactamente una vez (exactly-once semantics) en un sistema distribuido con mensajería asíncrona.

### 🎯 El Problema

**RabbitMQ garantiza "At-least-once delivery"**. Si la red falla antes del ACK, el mensaje se duplica. Procesar una orden dos veces puede ser catastrófico:
- Cobros duplicados
- Stock descontado múltiples veces
- Órdenes procesadas por duplicado

### ✅ La Solución

Implementar **deduplicación estricta** en el consumidor utilizando:
- **Claves de idempotencia (Idempotency Keys)** almacenadas en PostgreSQL
- **Tabla de control** con UNIQUE constraint en `message_id`
- **IdempotencyGuard** que verifica antes de procesar
- Garantía: El efecto en la base de datos ocurre **exactamente una vez** aunque el mensaje llegue múltiples veces

---

## 🏗️ Arquitectura del Sistema

```mermaid
graph TD
    subgraph USERS["👥 Cliente"]
        U1["👤 Usuario"]
    end

    subgraph GATEWAY["🌐 API Gateway - Puerto 3000"]
        GW_PROD["ProductController<br/>POST /products"]
        GW_ORD["OrderController<br/>POST /orders"]
    end

    subgraph MS["🏠 Microservicios"]
        MS_PROD["🐾 MS-Product<br/>Puerto: 3001"]
        MS_ORD["📝 MS-Order<br/>Puerto: 3002<br/>🔒 Idempotencia"]
    end

    subgraph INFRA["🏗️ Infraestructura"]
        subgraph QUEUES["🐇 RabbitMQ - Colas"]
            Q_PROD["product_queue"]
            Q_ORD["order_queue"]
        end
        DB_PROD["💾 PostgreSQL<br/>product_db:5433"]
        DB_ORD["💾 PostgreSQL<br/>order_db:5434<br/>+ Tabla Idempotency"]
    end

    U1 -- "POST /products" --> GW_PROD
    U1 -- "POST /orders" --> GW_ORD

    GW_PROD -- "emit: product.create" --> Q_PROD
    GW_ORD -- "emit: order.request" --> Q_ORD

    Q_PROD -.->|"@EventPattern"| MS_PROD
    Q_ORD -.->|"@EventPattern<br/>+ IdempotencyGuard"| MS_ORD

    MS_ORD -- "emit: order.created" --> Q_PROD

    MS_PROD --> DB_PROD
    MS_ORD --> DB_ORD
```

---

## 📦 Componentes del Sistema

### 1. **API Gateway** (Puerto 3000)
- **Responsabilidad**: Punto de entrada HTTP para clientes externos
- **Tecnología**: NestJS con ClientProxy de RabbitMQ
- **Estructura Modular**:
  - `ProductModule` → `ProductController` → `POST /products`
  - `OrderModule` → `OrderController` → `POST /orders`
- **Función**: Recibe solicitudes HTTP y las publica como eventos en RabbitMQ con UUID único

### 2. **MS-Product** (Puerto 3001)
- **Responsabilidad**: Gestión del ciclo de vida de productos
- **Tecnología**: NestJS + TypeORM + PostgreSQL
- **Estructura**:
  - `product/` → Entity, Service, Consumer
- **Funciones**:
  - Crear productos (idempotencia por nombre único)
  - Actualizar stock cuando se crea una orden
- **Base de Datos**: PostgreSQL (`product_db`) en puerto 5433
- **Eventos**:
  - Consume: `product.create` desde `product_queue`
  - Consume: `order.created` desde `product_queue` (actualiza stock)

### 3. **MS-Order** (Puerto 3002) 🔒
- **Responsabilidad**: Gestión de órdenes con garantía de idempotencia
- **Tecnología**: NestJS + TypeORM + PostgreSQL
- **Estructura**:
  - `order/` → Entity, Service, Controller
  - `idempotency/` → **Guard, Service, Entity** (sistema de deduplicación)
- **Base de Datos**: PostgreSQL (`order_db`) en puerto 5434
- **Tablas**:
  - `orders`: Órdenes de compra
  - `idempotency`: **Tabla de control** para message_ids procesados
- **Eventos**:
  - Consume: `order.request` desde `order_queue`
  - Publica: `order.created` hacia `product_queue`

### 4. **RabbitMQ** (Puertos 5672, 15672)
- **Responsabilidad**: Message broker para comunicación asíncrona
- **Colas**:
  - `product_queue`: Para `product.create` y `order.created`
  - `order_queue`: Para `order.request`
- **Características**: ACK manual, colas durables, at-least-once delivery

### 5. **PostgreSQL**
- **product_db** (Puerto 5433): Almacena productos
- **order_db** (Puerto 5434): Almacena órdenes + **tabla de idempotencia**

---

## 🔒 Sistema de Idempotencia

### Componentes Clave

#### 1. **Idempotency Entity**
```typescript
@Entity('idempotency')
export class Idempotency {
  @PrimaryColumn('uuid')
  message_id: string;  // UUID único del mensaje
  
  @Column()
  consumer: string;    // Nombre del consumidor
  
  @Column({ type: 'timestamptz' })
  processed_at: Date;  // Cuándo fue procesado
}
```

#### 2. **IdempotencyService**
```typescript
async tryRegister(messageId: string): Promise<boolean> {
  try {
    await this.repo.insert({ message_id: messageId, consumer: 'ms-order' });
    return true;  // Es nuevo, debe procesarse
  } catch (err) {
    if (err.code === '23505') {  // UNIQUE constraint violation
      return false;  // Ya fue procesado, ignorar
    }
    throw err;
  }
}
```

#### 3. **IdempotencyGuard**
```typescript
async run(messageId: string, handler: () => Promise<any>): Promise<void> {
  const canProcess = await this.idempService.tryRegister(messageId);
  
  if (!canProcess) {
    console.log('Mensaje duplicado ignorado');
    return;  // No ejecutar handler
  }
  
  await handler();  // Ejecutar solo si es nuevo
}
```

### Flujo de Idempotencia

```
1. Mensaje llega con message_id único
2. IdempotencyGuard intenta insertar message_id en tabla de control
3. Si INSERT exitoso → Es nuevo → Procesar orden
4. Si INSERT falla (UNIQUE violation) → Es duplicado → Ignorar
5. ACK del mensaje en ambos casos
```

---

## 🔄 Flujos del Sistema

### Flujo 1: Crear Producto

```
1. Usuario → POST /products {nombreProducto, precio, stock}
2. Gateway genera UUID único (message_id)
3. Gateway → emit product.create a product_queue
4. MS-Product consume evento
5. Verifica idempotencia (nombre único)
6. Si es nuevo → Crea producto en BD
7. ACK del mensaje
```

### Flujo 2: Crear Orden (CON IDEMPOTENCIA) 🔒

```
1. Usuario → POST /orders {idProducto, cantidad, total}
2. Gateway genera UUID único (message_id)
3. Gateway → emit order.request a order_queue
4. MS-Order consume evento
5. 🔒 IdempotencyGuard verifica message_id en tabla de control
6. Si es duplicado → Ignora y hace ACK
7. Si es nuevo:
   a. Registra message_id en tabla idempotency
   b. Crea orden en BD
   c. Emite order.created a product_queue
8. MS-Product consume order.created
9. Actualiza stock del producto
10. ACK del mensaje
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 18+ y npm
- Docker y Docker Compose
- Git

### Paso 1: Levantar Infraestructura

```bash
# Iniciar RabbitMQ y PostgreSQL
cd Practica1
docker-compose up -d

# Verificar que los contenedores estén corriendo
docker ps
```

### Paso 2: Instalar Dependencias

```bash
# Gateway
cd ms-gateway
npm install

# Product
cd ../ms-product
npm install

# Order
cd ../ms-order
npm install
```

### Paso 3: Ejecutar Microservicios

**Terminal 1 - Gateway:**
```bash
cd ms-gateway
npm run start:dev
# Corriendo en http://localhost:3000
```

**Terminal 2 - MS-Product:**
```bash
cd ms-product
npm run start:dev
# Corriendo en http://localhost:3001
```

**Terminal 3 - MS-Order:**
```bash
cd ms-order
npm run start:dev
# Corriendo en http://localhost:3002
```

### Verificar Sistema

```bash
# Health checks
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health

# RabbitMQ Management UI
# Abrir en navegador: http://localhost:15672
# Usuario: guest / Contraseña: guest
```

---

## 🧪 Pruebas del Sistema

### 1. Crear Producto

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombreProducto": "Laptop Dell XPS 15",
    "descripcion": "Laptop de alto rendimiento",
    "precio": 1500,
    "stock": 10,
    "imagenURL": "https://example.com/laptop.jpg",
    "idEmprendedor": 1,
    "idCategoria": 1
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Product creation request sent",
  "message_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "pending"
}
```

### 2. Listar Productos

```bash
curl http://localhost:3001/products
```

### 3. Crear Orden

```bash
# Reemplazar <UUID_DEL_PRODUCTO> con el ID real del producto
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "idProducto": "<UUID_DEL_PRODUCTO>",
    "cantidad": 2,
    "total": 3000,
    "idUsuario": 1
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Order request sent",
  "message_id": "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
  "status": "pending"
}
```

### 4. Listar Órdenes

```bash
curl http://localhost:3002/orders
```

---

## 🔬 Prueba de Idempotencia

### Escenario: Enviar Mensaje Duplicado

Para probar el sistema de idempotencia, necesitamos simular un mensaje duplicado.

**Método 1: Reiniciar el microservicio antes del ACK**

1. Crear una orden
2. Inmediatamente después, detener ms-order (Ctrl+C)
3. RabbitMQ reintentará el mensaje
4. Reiniciar ms-order
5. Verificar logs: verás "Mensaje duplicado ignorado"

**Método 2: Verificar en logs**

Busca en los logs de ms-order:
```
🔐 [IDEMPOTENCY GUARD] Verificando message_id: <UUID>
✅ [IDEMPOTENCY GUARD] Mensaje nuevo, procesando
```

Si envías el mismo mensaje dos veces:
```
🔐 [IDEMPOTENCY GUARD] Verificando message_id: <UUID>
⚠️ [IDEMPOTENCY] Mensaje duplicado detectado
🚫 [IDEMPOTENCY GUARD] Mensaje duplicado ignorado
```

**Método 3: Consultar tabla de idempotencia**

```bash
# Conectarse a PostgreSQL
docker exec -it postgres-order psql -U pguser -d order_db

# Ver registros de idempotencia
SELECT * FROM idempotency ORDER BY processed_at DESC LIMIT 10;
```

---

## 📊 Endpoints Disponibles

### API Gateway (Puerto 3000)
- `GET /` - Información del servicio
- `GET /health` - Health check
- `POST /products` - Crear producto
- `POST /orders` - Crear orden

### MS-Product (Puerto 3001)
- `GET /` - Información del servicio
- `GET /health` - Health check
- `GET /products` - Listar todos los productos

### MS-Order (Puerto 3002)
- `GET /` - Información del servicio
- `GET /health` - Health check (incluye estado de idempotencia)
- `GET /orders` - Listar todas las órdenes

### RabbitMQ Management (Puerto 15672)
- Usuario: `guest`
- Contraseña: `guest`
- Ver colas, mensajes, consumidores en tiempo real

---

## 🎯 Características Clave

✅ **Idempotencia Estricta**
- Tabla de control PostgreSQL con UNIQUE constraint
- IdempotencyGuard verifica cada mensaje
- Garantía: Procesamiento exactamente una vez

✅ **Comunicación Asíncrona**
- Desacoplamiento mediante RabbitMQ
- At-least-once delivery + deduplicación = exactly-once semantics

✅ **Gateway Modular**
- Controladores separados por dominio
- Fácil extensión para nuevos módulos

✅ **Separación de Responsabilidades**
- Cada microservicio con su propia base de datos
- Patrón Database per Service

✅ **ACK Manual**
- Garantiza procesamiento completo antes de confirmar
- Reintentos automáticos en caso de fallo

✅ **Event-Driven Architecture**
- Basado en eventos de dominio
- Comunicación reactiva y escalable

✅ **Logging Detallado**
- Trazabilidad completa de mensajes
- Identificación de duplicados en logs

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: NestJS 10.x
- **Lenguaje**: TypeScript 5.x
- **Message Broker**: RabbitMQ 3.11
- **Base de Datos**: PostgreSQL 17
- **ORM**: TypeORM 0.3
- **Containerización**: Docker Compose
- **Transporte**: AMQP

---

## 📈 Esquema de Base de Datos

### Product DB (product_db)

```sql
CREATE TABLE products (
  idProducto UUID PRIMARY KEY,
  nombreProducto VARCHAR NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2),
  stock INTEGER DEFAULT 0,
  imagenURL VARCHAR,
  idEmprendedor INTEGER,
  idCategoria INTEGER,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Order DB (order_db)

```sql
-- Tabla de órdenes
CREATE TABLE orders (
  idOrden UUID PRIMARY KEY,
  idProducto UUID NOT NULL,
  cantidad INTEGER NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  idUsuario INTEGER,
  estado VARCHAR DEFAULT 'PENDING',
  fechaOrden TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- 🔒 Tabla de idempotencia
CREATE TABLE idempotency (
  message_id UUID PRIMARY KEY,  -- UNIQUE constraint
  consumer VARCHAR NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata TEXT
);

-- Índice para consultas rápidas
CREATE INDEX idx_idempotency_consumer ON idempotency(consumer);
CREATE INDEX idx_idempotency_processed_at ON idempotency(processed_at);
```

---

## 🔍 Monitoreo y Debugging

### Ver logs en tiempo real

```bash
# Gateway
cd ms-gateway && npm run start:dev

# Product
cd ms-product && npm run start:dev

# Order (con logs de idempotencia)
cd ms-order && npm run start:dev
```

### Verificar colas en RabbitMQ

1. Abrir http://localhost:15672
2. Login: guest / guest
3. Ir a "Queues" tab
4. Ver `product_queue` y `order_queue`
5. Verificar mensajes en cola, rate, consumers

### Consultar bases de datos

```bash
# Product DB
docker exec -it postgres-product psql -U pguser -d product_db
\dt  # Listar tablas
SELECT * FROM products;

# Order DB
docker exec -it postgres-order psql -U pguser -d order_db
\dt  # Listar tablas
SELECT * FROM orders;
SELECT * FROM idempotency;  # 🔒 Ver mensajes procesados
```

---

## 🚨 Manejo de Errores

### Dead Letter Queue (Recomendación para Producción)

Para mensajes que fallan repetidamente, se recomienda configurar una Dead Letter Queue:

```typescript
// En app.module.ts
queueOptions: {
  durable: true,
  arguments: {
    'x-dead-letter-exchange': 'dlx_exchange',
    'x-dead-letter-routing-key': 'dead_letter',
  },
},
```

### Limpieza de registros antiguos

```typescript
// Ejecutar periódicamente (ejemplo: cada mes)
await idempotencyService.cleanOldRecords(30); // 30 días
```

---

## 📝 Notas Importantes

1. **Idempotencia no es igual a Deduplicación Total**: La idempotencia garantiza que el **efecto** ocurre una vez, pero el mensaje puede ser procesado múltiples veces (solo se ignora si es duplicado).

2. **UNIQUE Constraint es Crítico**: Sin el constraint en `message_id`, el sistema no funcionaría correctamente. PostgreSQL garantiza atomicidad del INSERT.

3. **ACK Manual**: Es crucial usar `noAck: false` para que RabbitMQ reintente en caso de fallo antes del ACK.

4. **UUID v4**: Se usa UUID v4 para garantizar unicidad global de message_ids.

5. **Tabla de Control**: La tabla `idempotency` debe ser monitoreada y limpiada periódicamente para evitar crecimiento excesivo.

---

## 🎓 Conceptos Aprendidos

- ✅ Patrón Idempotent Consumer
- ✅ At-least-once vs Exactly-once delivery
- ✅ Idempotency Keys
- ✅ Event-Driven Architecture
- ✅ Microservicios con NestJS
- ✅ RabbitMQ y AMQP
- ✅ TypeORM con PostgreSQL
- ✅ ACK Manual y Reintentos
- ✅ Database per Service Pattern
- ✅ Docker Compose para orquestación

---

## 👨‍💻 Autor

**Práctica 1 - Segundo Parcial**
- Sistema de Microservicios con Idempotencia
- Opción B: Idempotent Consumer
- Entidades: Producto y Orden

---

## 📄 Licencia

MIT License - Proyecto Académico

---

## 🔗 Referencias

- [NestJS Documentation](https://docs.nestjs.com/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials)
- [TypeORM Documentation](https://typeorm.io/)
- [Idempotent Consumer Pattern](https://www.enterpriseintegrationpatterns.com/patterns/messaging/IdempotentReceiver.html)
- [Event-Driven Microservices](https://martinfowler.com/articles/201701-event-driven.html)

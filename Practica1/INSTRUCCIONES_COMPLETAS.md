# 🎉 SISTEMA DE MICROSERVICIOS CON IDEMPOTENCIA - COMPLETADO

## ✅ Proyecto Implementado

Has implementado exitosamente un **sistema de microservicios con idempotencia** usando:
- **Opción B: Idempotent Consumer Pattern**
- **Entidades**: Producto y Orden
- **Tecnologías**: NestJS, RabbitMQ, PostgreSQL, Docker

---

## 📁 Estructura Creada

```
Practica1/
├── docker-compose.yml              # ✅ Infraestructura (RabbitMQ + PostgreSQL)
├── .gitignore                      # ✅ Configuración Git
│
├── ms-gateway/                     # ✅ API Gateway (Puerto 3000)
│   ├── src/
│   │   ├── product/
│   │   │   ├── product.controller.ts
│   │   │   └── product.module.ts
│   │   ├── order/
│   │   │   ├── order.controller.ts
│   │   │   └── order.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── ms-product/                     # ✅ Microservicio Productos (Puerto 3001)
│   ├── src/
│   │   ├── product/
│   │   │   ├── product.entity.ts
│   │   │   ├── product.service.ts
│   │   │   └── product.consumer.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── ms-order/                       # ✅ Microservicio Órdenes (Puerto 3002)
│   ├── src/
│   │   ├── order/
│   │   │   ├── order.entity.ts
│   │   │   ├── order.service.ts
│   │   │   └── order.controller.ts
│   │   ├── idempotency/            # 🔒 SISTEMA DE IDEMPOTENCIA
│   │   │   ├── idempotency.entity.ts
│   │   │   ├── idempotency.service.ts
│   │   │   └── idempotency.guard.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── README.md                       # ✅ Documentación completa
├── QUICKSTART.md                   # ✅ Guía rápida
├── PRUEBAS.md                      # ✅ Scripts de prueba
└── COMANDOS.md                     # ✅ Comandos útiles
```

---

## 🚀 PASOS PARA EJECUTAR EL PROYECTO

### Paso 1: Levantar Infraestructura (Docker)

```powershell
cd "c:\Users\HP\OneDrive\Documentos\SEXTO NIVEL\Servidor Web\SegundoParcial-P\Practica1"

# Iniciar RabbitMQ y PostgreSQL
docker-compose up -d

# Verificar que estén corriendo
docker ps
```

**Deberías ver:**
- `rabbitmq` (puertos 5672, 15672)
- `postgres-product` (puerto 5433)
- `postgres-order` (puerto 5434)

---

### Paso 2: Instalar Dependencias

**Abrir PowerShell y ejecutar:**

```powershell
# Gateway
cd "c:\Users\HP\OneDrive\Documentos\SEXTO NIVEL\Servidor Web\SegundoParcial-P\Practica1\ms-gateway"
npm install

# Product
cd "c:\Users\HP\OneDrive\Documentos\SEXTO NIVEL\Servidor Web\SegundoParcial-P\Practica1\ms-product"
npm install

# Order
cd "c:\Users\HP\OneDrive\Documentos\SEXTO NIVEL\Servidor Web\SegundoParcial-P\Practica1\ms-order"
npm install
```

---

### Paso 3: Ejecutar Microservicios (3 Terminales)

**Terminal 1 - Gateway:**
```powershell
cd "c:\Users\HP\OneDrive\Documentos\SEXTO NIVEL\Servidor Web\SegundoParcial-P\Practica1\ms-gateway"
npm run start:dev
```

**Terminal 2 - Product:**
```powershell
cd "c:\Users\HP\OneDrive\Documentos\SEXTO NIVEL\Servidor Web\SegundoParcial-P\Practica1\ms-product"
npm run start:dev
```

**Terminal 3 - Order:**
```powershell
cd "c:\Users\HP\OneDrive\Documentos\SEXTO NIVEL\Servidor Web\SegundoParcial-P\Practica1\ms-order"
npm run start:dev
```

---

### Paso 4: Verificar que Todo Funciona

```powershell
# Health checks
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

**También puedes abrir en el navegador:**
- http://localhost:3000/health
- http://localhost:15672 (RabbitMQ Management - guest/guest)

---

## 🧪 PRUEBAS DEL SISTEMA

### 1. Crear un Producto

```powershell
curl -X POST http://localhost:3000/products `
  -H "Content-Type: application/json" `
  -d '{\"nombreProducto\":\"Laptop Dell XPS 15\",\"descripcion\":\"Laptop de alto rendimiento\",\"precio\":1500,\"stock\":10}'
```

### 2. Listar Productos

```powershell
curl http://localhost:3001/products
```

**Copia el `idProducto` (UUID) del producto creado.**

### 3. Crear una Orden

```powershell
# Reemplazar <UUID_DEL_PRODUCTO> con el ID real
curl -X POST http://localhost:3000/orders `
  -H "Content-Type: application/json" `
  -d '{\"idProducto\":\"<UUID_DEL_PRODUCTO>\",\"cantidad\":2,\"total\":3000}'
```

### 4. Listar Órdenes

```powershell
curl http://localhost:3002/orders
```

---

## 🔒 VERIFICAR SISTEMA DE IDEMPOTENCIA

### Método 1: Ver Logs

En la terminal de **ms-order**, busca estos mensajes:

**Cuando procesa un mensaje nuevo:**
```
🔐 [IDEMPOTENCY GUARD] Verificando message_id: <UUID>
🔒 [IDEMPOTENCY] Message ID registrado: <UUID>
✅ [IDEMPOTENCY GUARD] Mensaje nuevo, procesando
✅ Orden creada: <UUID>
```

**Cuando detecta un duplicado:**
```
🔐 [IDEMPOTENCY GUARD] Verificando message_id: <UUID>
⚠️ [IDEMPOTENCY] Mensaje duplicado detectado: <UUID>
🚫 [IDEMPOTENCY GUARD] Mensaje duplicado ignorado
```

### Método 2: Consultar Base de Datos

```powershell
# Conectarse a la base de datos de órdenes
docker exec -it postgres-order psql -U pguser -d order_db

# Ver tabla de idempotencia
SELECT * FROM idempotency ORDER BY processed_at DESC LIMIT 10;

# Salir
\q
```

---

## 📊 MONITOREO

### RabbitMQ Management UI

1. Abrir http://localhost:15672
2. Login: **guest** / **guest**
3. Ver colas:
   - `product_queue`
   - `order_queue`
4. Verificar consumidores activos
5. Ver mensajes procesados

### Ver Logs de Docker

```powershell
# Ver todos los logs
docker-compose logs -f

# Ver logs de RabbitMQ
docker-compose logs -f rabbitmq

# Ver logs de PostgreSQL
docker-compose logs -f postgres-order
```

---

## 🎯 CARACTERÍSTICAS IMPLEMENTADAS

### ✅ Sistema de Idempotencia Completo

1. **Tabla de Control** (`idempotency`)
   - UNIQUE constraint en `message_id`
   - Almacena todos los mensajes procesados

2. **IdempotencyService**
   - `tryRegister()`: Intenta registrar message_id
   - Retorna `false` si es duplicado

3. **IdempotencyGuard**
   - Middleware que ejecuta handler solo si es nuevo
   - Ignora mensajes duplicados automáticamente

### ✅ Arquitectura Event-Driven

1. **API Gateway** → Publica eventos a RabbitMQ
2. **MS-Product** → Consume eventos de productos
3. **MS-Order** → Consume eventos de órdenes (con idempotencia)
4. **RabbitMQ** → Garantiza at-least-once delivery
5. **Idempotencia** → Convierte a exactly-once semantics

### ✅ Flujos Implementados

**Flujo 1: Crear Producto**
```
Usuario → Gateway → RabbitMQ → MS-Product → PostgreSQL
```

**Flujo 2: Crear Orden (con Idempotencia)**
```
Usuario → Gateway → RabbitMQ → MS-Order → Verificar Idempotencia
                                              ↓
                                         ¿Duplicado?
                                    NO ↓         ↓ SÍ
                            Procesar + Guardar  Ignorar
                                    ↓
                            Actualizar Stock
```

---

## 📚 DOCUMENTACIÓN

- **README.md**: Documentación completa con arquitectura, diagramas, conceptos
- **QUICKSTART.md**: Guía rápida de inicio
- **PRUEBAS.md**: Scripts de prueba con ejemplos
- **COMANDOS.md**: Comandos útiles para desarrollo

---

## 🔧 COMANDOS ÚTILES

### Detener Todo

```powershell
# Detener microservicios: Ctrl+C en cada terminal

# Detener Docker
docker-compose down

# Detener y limpiar volúmenes (borra las BDs)
docker-compose down -v
```

### Reiniciar

```powershell
# Reiniciar Docker
docker-compose restart

# Reiniciar un servicio específico
docker-compose restart rabbitmq
```

### Ver Estado

```powershell
# Ver contenedores
docker ps

# Ver colas de RabbitMQ
docker exec -it rabbitmq rabbitmqctl list_queues
```

---

## 🎓 CONCEPTOS APRENDIDOS

- ✅ **Idempotent Consumer Pattern**
- ✅ **At-least-once vs Exactly-once Delivery**
- ✅ **Event-Driven Architecture**
- ✅ **Microservicios con NestJS**
- ✅ **RabbitMQ y AMQP**
- ✅ **TypeORM con PostgreSQL**
- ✅ **ACK Manual y Reintentos**
- ✅ **Database per Service Pattern**
- ✅ **Docker Compose**

---

## 🚨 TROUBLESHOOTING

### Problema: Puerto ocupado

```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :5672

# Matar proceso (reemplazar PID)
taskkill /PID <PID> /F
```

### Problema: Docker no inicia

```powershell
# Verificar Docker Desktop está corriendo
docker --version

# Reiniciar Docker Desktop
```

### Problema: No se conecta a PostgreSQL

```powershell
# Verificar que los contenedores estén corriendo
docker ps

# Ver logs de PostgreSQL
docker-compose logs postgres-order

# Reiniciar contenedor
docker-compose restart postgres-order
```

---

## ✨ PROYECTO COMPLETADO

¡Felicidades! Has implementado exitosamente:

✅ Sistema de microservicios completo
✅ Patrón Idempotent Consumer
✅ Event-Driven Architecture con RabbitMQ
✅ Base de datos PostgreSQL por servicio
✅ Sistema de idempotencia con tabla de control
✅ Docker Compose para infraestructura
✅ Documentación completa

---

## 📝 PARA ENTREGAR

1. **Código fuente**: Carpeta `Practica1` completa
2. **README.md**: Documentación detallada
3. **Capturas de pantalla**:
   - Health checks funcionando
   - RabbitMQ Management UI
   - Logs mostrando idempotencia
   - Consultas a base de datos
4. **Video (opcional)**: Demo del sistema funcionando

---

## 🎯 PRÓXIMOS PASOS (Mejoras Opcionales)

- [ ] Implementar Dead Letter Queue para errores
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar Circuit Breaker pattern
- [ ] Agregar monitoreo con Prometheus/Grafana
- [ ] Implementar autenticación JWT
- [ ] Agregar OpenTelemetry para tracing
- [ ] Crear frontend con React/Angular

---

## 👨‍💻 AUTOR

**Práctica 1 - Segundo Parcial**
- Sistema de Microservicios con Idempotencia
- Opción B: Idempotent Consumer
- Entidades: Producto y Orden

---

**¡Proyecto listo para usar y entregar! 🎉**

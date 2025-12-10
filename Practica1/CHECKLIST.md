# ✅ CHECKLIST DE VERIFICACIÓN DEL PROYECTO

Use este checklist para verificar que todo está funcionando correctamente antes de entregar.

---

## 📋 ANTES DE INICIAR

### Prerrequisitos Instalados
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Docker Desktop instalado y corriendo (`docker --version`)
- [ ] Docker Compose instalado (`docker-compose --version`)
- [ ] Git instalado (opcional) (`git --version`)

---

## 🏗️ INFRAESTRUCTURA

### Docker Compose
- [ ] `docker-compose up -d` ejecutado sin errores
- [ ] Verificar contenedores corriendo: `docker ps`
  - [ ] rabbitmq (puertos 5672, 15672)
  - [ ] postgres-product (puerto 5433)
  - [ ] postgres-order (puerto 5434)
- [ ] RabbitMQ Management UI accesible en http://localhost:15672
- [ ] Login en RabbitMQ funciona (guest/guest)

### PostgreSQL
- [ ] Conectar a product_db: `docker exec -it postgres-product psql -U pguser -d product_db`
- [ ] Conectar a order_db: `docker exec -it postgres-order psql -U pguser -d order_db`
- [ ] Bases de datos creadas correctamente

---

## 🔧 INSTALACIÓN

### Dependencias
- [ ] `npm install` ejecutado en ms-gateway (sin errores)
- [ ] `npm install` ejecutado en ms-product (sin errores)
- [ ] `npm install` ejecutado en ms-order (sin errores)
- [ ] Carpetas `node_modules` creadas en cada microservicio

---

## 🚀 EJECUCIÓN

### Microservicios Iniciados
- [ ] ms-gateway corriendo en puerto 3000
  - [ ] Logs muestran: "ms-gateway running on port 3000"
  - [ ] Sin errores de conexión a RabbitMQ
- [ ] ms-product corriendo en puerto 3001
  - [ ] Logs muestran: "ms-product running on port 3001"
  - [ ] Logs muestran: "Listening to product_queue..."
  - [ ] Conectado a product_db exitosamente
- [ ] ms-order corriendo en puerto 3002
  - [ ] Logs muestran: "ms-order running on port 3002"
  - [ ] Logs muestran: "Listening to order_queue..."
  - [ ] Logs muestran: "Sistema de idempotencia activado"
  - [ ] Conectado a order_db exitosamente

### Health Checks
- [ ] `curl http://localhost:3000/health` retorna status OK
- [ ] `curl http://localhost:3001/health` retorna status OK
- [ ] `curl http://localhost:3002/health` retorna status OK (con idempotency: enabled)

---

## 🧪 PRUEBAS FUNCIONALES

### 1. Crear Producto
- [ ] Ejecutar curl para crear producto
- [ ] Respuesta incluye `message_id` y `status: pending`
- [ ] Logs de ms-product muestran: "📥 product.create recibido"
- [ ] Logs muestran: "✅ Producto CREADO: <UUID>"
- [ ] RabbitMQ Management muestra mensaje procesado en product_queue

### 2. Listar Productos
- [ ] `curl http://localhost:3001/products` retorna array con productos
- [ ] Producto creado aparece en la lista
- [ ] Verificar campos: idProducto, nombreProducto, precio, stock

### 3. Crear Orden
- [ ] Copiar UUID del producto creado
- [ ] Ejecutar curl para crear orden (reemplazar UUID)
- [ ] Respuesta incluye `message_id` y `status: pending`
- [ ] Logs de ms-order muestran: "📥 Procesando order.request..."
- [ ] Logs muestran: "🔐 [IDEMPOTENCY GUARD] Verificando message_id"
- [ ] Logs muestran: "✅ [IDEMPOTENCY GUARD] Mensaje nuevo, procesando"
- [ ] Logs muestran: "✅ Orden creada"
- [ ] Logs de ms-product muestran: "📥 order.created recibido"
- [ ] Logs muestran: "✅ Stock actualizado exitosamente"

### 4. Listar Órdenes
- [ ] `curl http://localhost:3002/orders` retorna array con órdenes
- [ ] Orden creada aparece en la lista
- [ ] Verificar campos: idOrden, idProducto, cantidad, total, estado

### 5. Verificar Stock Actualizado
- [ ] Listar productos nuevamente
- [ ] Verificar que el stock se redujo correctamente
- [ ] Stock anterior - cantidad de la orden = Stock actual

---

## 🔒 VERIFICACIÓN DE IDEMPOTENCIA

### Tabla de Idempotencia
- [ ] Conectar a order_db: `docker exec -it postgres-order psql -U pguser -d order_db`
- [ ] Ejecutar: `SELECT * FROM idempotency ORDER BY processed_at DESC LIMIT 10;`
- [ ] Verificar que existen registros con message_id
- [ ] Verificar columna `consumer` = 'ms-order'
- [ ] Verificar timestamp `processed_at` reciente

### Logs de Idempotencia
- [ ] Logs de ms-order muestran mensajes del IdempotencyGuard
- [ ] Para mensaje nuevo: "✅ [IDEMPOTENCY GUARD] Mensaje nuevo, procesando"
- [ ] Para mensaje duplicado (si se prueba): "🚫 [IDEMPOTENCY GUARD] Mensaje duplicado ignorado"

### RabbitMQ
- [ ] Abrir http://localhost:15672
- [ ] Ver cola `order_queue`
- [ ] Verificar que tiene consumidor activo (ms-order)
- [ ] Verificar mensajes procesados (Ack)

---

## 📊 MONITOREO

### RabbitMQ Management UI
- [ ] Acceder a http://localhost:15672
- [ ] Login exitoso (guest/guest)
- [ ] Ver pestaña "Queues"
- [ ] Verificar `product_queue` existe y tiene consumidor
- [ ] Verificar `order_queue` existe y tiene consumidor
- [ ] Ver pestaña "Connections" (debe mostrar 2 conexiones activas)

### Base de Datos
- [ ] Consultar tabla `products` en product_db
- [ ] Consultar tabla `orders` en order_db
- [ ] Consultar tabla `idempotency` en order_db
- [ ] Verificar integridad de datos

---

## 📚 DOCUMENTACIÓN

### Archivos Creados
- [ ] README.md existe y es completo
- [ ] INSTRUCCIONES_COMPLETAS.md existe
- [ ] QUICKSTART.md existe
- [ ] PRUEBAS.md existe
- [ ] COMANDOS.md existe
- [ ] RESUMEN.md existe
- [ ] docker-compose.yml existe

### Contenido de Documentación
- [ ] README incluye arquitectura con diagrama
- [ ] README explica el problema y la solución
- [ ] README incluye flujos del sistema
- [ ] README incluye instrucciones de instalación
- [ ] README incluye ejemplos de uso
- [ ] Documentación del sistema de idempotencia completa

---

## 🎯 CARACTERÍSTICAS IMPLEMENTADAS

### Sistema de Idempotencia
- [ ] IdempotencyEntity creada
- [ ] IdempotencyService implementado con tryRegister()
- [ ] IdempotencyGuard implementado con run()
- [ ] Tabla idempotency con UNIQUE constraint
- [ ] Sistema probado y funcionando

### Arquitectura Event-Driven
- [ ] Gateway publica eventos a RabbitMQ
- [ ] ms-product consume eventos
- [ ] ms-order consume eventos
- [ ] Comunicación asíncrona funcional
- [ ] ACK manual configurado

### Microservicios
- [ ] 3 microservicios independientes
- [ ] Cada uno con su propia base de datos
- [ ] TypeORM configurado correctamente
- [ ] Entidades definidas (Product, Order, Idempotency)
- [ ] Servicios implementados
- [ ] Controllers/Consumers implementados

---

## 🔧 FUNCIONALIDAD COMPLETA

### Flujo de Producto
- [ ] POST /products crea producto
- [ ] Evento se publica a RabbitMQ
- [ ] ms-product consume evento
- [ ] Producto se guarda en BD
- [ ] Idempotencia por nombre funciona
- [ ] GET /products lista productos

### Flujo de Orden
- [ ] POST /orders crea orden
- [ ] Evento se publica a RabbitMQ
- [ ] ms-order consume evento
- [ ] IdempotencyGuard verifica message_id
- [ ] Orden se guarda en BD (si es nueva)
- [ ] Evento order.created se publica
- [ ] ms-product actualiza stock
- [ ] GET /orders lista órdenes

---

## 🎨 CÓDIGO

### Calidad
- [ ] Código limpio y legible
- [ ] Comentarios explicativos en código crítico
- [ ] Nombres de variables descriptivos
- [ ] Estructura de carpetas organizada
- [ ] Sin código comentado innecesario

### Configuración
- [ ] package.json configurados correctamente
- [ ] tsconfig.json configurados
- [ ] nest-cli.json configurados
- [ ] .prettierrc creados (formato consistente)
- [ ] .gitignore incluye node_modules y dist

---

## 🚨 PRUEBAS DE ERROR

### Resiliencia
- [ ] Detener ms-order y enviar orden → Reiniciar → Verificar reintento
- [ ] Enviar orden con producto inexistente → Verificar manejo de error
- [ ] Detener RabbitMQ → Verificar reconexión automática
- [ ] Stock insuficiente → Verificar mensaje de error en logs

### Idempotencia
- [ ] Simular mensaje duplicado (ver INSTRUCCIONES_COMPLETAS.md)
- [ ] Verificar que solo se procesa una vez
- [ ] Verificar logs de "Mensaje duplicado ignorado"
- [ ] Consultar tabla idempotency para confirmar

---

## 📸 EVIDENCIA (Para Entrega)

### Capturas de Pantalla Requeridas
- [ ] Health checks de los 3 microservicios
- [ ] RabbitMQ Management UI mostrando colas
- [ ] Logs de ms-order mostrando idempotencia
- [ ] Consulta SQL a tabla idempotency
- [ ] GET /products mostrando productos
- [ ] GET /orders mostrando órdenes
- [ ] Stock actualizado después de orden

### Video Demo (Opcional)
- [ ] Inicio de infraestructura (Docker)
- [ ] Inicio de microservicios
- [ ] Crear producto
- [ ] Crear orden
- [ ] Mostrar logs de idempotencia
- [ ] Consultar base de datos

---

## ✨ ENTREGA FINAL

### Archivos a Entregar
- [ ] Carpeta completa `Practica1/`
- [ ] Todos los archivos de código fuente
- [ ] Toda la documentación
- [ ] docker-compose.yml
- [ ] README.md completo

### Documentación a Incluir
- [ ] README.md con explicación completa
- [ ] Capturas de pantalla
- [ ] Video (si se solicita)
- [ ] Explicación del patrón Idempotent Consumer
- [ ] Diagrama de arquitectura

### Verificación Final
- [ ] Todo el código compila sin errores
- [ ] Todos los servicios inician correctamente
- [ ] Todas las pruebas funcionan
- [ ] Documentación completa y clara
- [ ] Sistema de idempotencia demostrado

---

## 🎓 CONCEPTOS VALIDADOS

- [ ] Entiendo el patrón Idempotent Consumer
- [ ] Entiendo at-least-once vs exactly-once delivery
- [ ] Entiendo el uso de claves de idempotencia
- [ ] Entiendo Event-Driven Architecture
- [ ] Entiendo microservicios con NestJS
- [ ] Entiendo RabbitMQ y AMQP
- [ ] Entiendo TypeORM y PostgreSQL
- [ ] Entiendo ACK manual y reintentos

---

## 🏁 ESTADO FINAL

Una vez completado todo el checklist:

- [ ] **✅ PROYECTO 100% COMPLETO**
- [ ] **✅ LISTO PARA ENTREGAR**
- [ ] **✅ TODOS LOS TESTS PASADOS**
- [ ] **✅ DOCUMENTACIÓN COMPLETA**
- [ ] **✅ SISTEMA FUNCIONAL**

---

**Fecha de verificación:** _____________
**Verificado por:** _____________
**Estado:** ⬜ En Progreso | ⬜ Completado | ⬜ Listo para Entregar

---

## 📝 NOTAS ADICIONALES

_Espacio para notas, observaciones o problemas encontrados durante la verificación:_

```
[Escribe aquí tus notas]
```

---

**Si todos los items están marcados ✅, ¡tu proyecto está listo para entregar! 🎉**

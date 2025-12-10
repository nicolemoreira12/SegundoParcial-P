# COMANDOS ÚTILES PARA DESARROLLO

# ============================================
# DOCKER
# ============================================

# Iniciar infraestructura
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (limpia las BDs)
docker-compose down -v

# Ver estado de contenedores
docker ps

# Reiniciar un servicio específico
docker-compose restart rabbitmq
docker-compose restart postgres-product
docker-compose restart postgres-order


# ============================================
# RABBITMQ
# ============================================

# Management UI
# http://localhost:15672
# Usuario: guest
# Contraseña: guest

# Ver colas desde CLI
docker exec -it rabbitmq rabbitmqctl list_queues

# Ver consumidores
docker exec -it rabbitmq rabbitmqctl list_consumers


# ============================================
# POSTGRESQL
# ============================================

# Conectarse a Product DB
docker exec -it postgres-product psql -U pguser -d product_db

# Conectarse a Order DB
docker exec -it postgres-order psql -U pguser -d order_db

# Comandos útiles en psql:
# \dt              - Listar tablas
# \d+ <tabla>      - Describir tabla
# \q               - Salir

# Consultas SQL útiles:

# Product DB
SELECT * FROM products ORDER BY "createdAt" DESC;
SELECT COUNT(*) FROM products;

# Order DB
SELECT * FROM orders ORDER BY "fechaOrden" DESC;
SELECT * FROM idempotency ORDER BY processed_at DESC LIMIT 20;
SELECT COUNT(*) FROM idempotency;

# Ver duplicados detectados
SELECT message_id, consumer, processed_at 
FROM idempotency 
WHERE consumer = 'ms-order' 
ORDER BY processed_at DESC;


# ============================================
# MICROSERVICIOS
# ============================================

# Instalar dependencias en todos
cd ms-gateway && npm install
cd ../ms-product && npm install
cd ../ms-order && npm install

# Iniciar en modo desarrollo (3 terminales separadas)

# Terminal 1 - Gateway
cd ms-gateway
npm run start:dev

# Terminal 2 - Product
cd ms-product
npm run start:dev

# Terminal 3 - Order
cd ms-order
npm run start:dev


# ============================================
# PRUEBAS RÁPIDAS
# ============================================

# Health checks
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health

# Información del servicio
curl http://localhost:3000
curl http://localhost:3001
curl http://localhost:3002


# ============================================
# LIMPIEZA
# ============================================

# Limpiar node_modules
rm -rf ms-gateway/node_modules
rm -rf ms-product/node_modules
rm -rf ms-order/node_modules

# Limpiar dist
rm -rf ms-gateway/dist
rm -rf ms-product/dist
rm -rf ms-order/dist

# Limpiar todo Docker
docker-compose down -v
docker system prune -a


# ============================================
# DEBUGGING
# ============================================

# Ver logs en tiempo real de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f rabbitmq
docker-compose logs -f postgres-order

# Verificar conectividad de red
docker network ls
docker network inspect practica1_microservices-network

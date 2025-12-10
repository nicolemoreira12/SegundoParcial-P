# PRUEBAS RÁPIDAS DEL SISTEMA

# ============================================
# 1. VERIFICAR SALUD DEL SISTEMA
# ============================================

# Gateway
curl http://localhost:3000/health

# MS-Product
curl http://localhost:3001/health

# MS-Order (con estado de idempotencia)
curl http://localhost:3002/health


# ============================================
# 2. CREAR PRODUCTO
# ============================================

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombreProducto": "Laptop Dell XPS 15",
    "descripcion": "Laptop de alto rendimiento con 16GB RAM",
    "precio": 1500,
    "stock": 10,
    "imagenURL": "https://example.com/laptop.jpg",
    "idEmprendedor": 1,
    "idCategoria": 1
  }'

# Crear otro producto
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombreProducto": "Mouse Logitech MX Master",
    "descripcion": "Mouse inalámbrico ergonómico",
    "precio": 99.99,
    "stock": 50,
    "imagenURL": "https://example.com/mouse.jpg",
    "idEmprendedor": 1,
    "idCategoria": 2
  }'


# ============================================
# 3. LISTAR PRODUCTOS
# ============================================

curl http://localhost:3001/products


# ============================================
# 4. CREAR ORDEN
# ============================================

# IMPORTANTE: Reemplazar <UUID_DEL_PRODUCTO> con el ID real
# Obtenlo del paso anterior (GET /products)

curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "idProducto": "<UUID_DEL_PRODUCTO>",
    "cantidad": 2,
    "total": 3000,
    "idUsuario": 1
  }'


# ============================================
# 5. LISTAR ÓRDENES
# ============================================

curl http://localhost:3002/orders


# ============================================
# 6. PRUEBA DE IDEMPOTENCIA
# ============================================

# Para probar idempotencia:
# 1. Crea una orden
# 2. Inmediatamente después, detén ms-order (Ctrl+C)
# 3. RabbitMQ reintentará el mensaje
# 4. Reinicia ms-order
# 5. En los logs verás: "Mensaje duplicado ignorado"

# Observa los logs de ms-order:
# ✅ [IDEMPOTENCY GUARD] Mensaje nuevo, procesando
# O bien:
# 🚫 [IDEMPOTENCY GUARD] Mensaje duplicado ignorado

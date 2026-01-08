# 📚 Documentación de Tools - MCP Server

Esta documentación describe todos los **Tools** disponibles en el MCP Server para ser invocados por Gemini AI.

---

## 🛠️ Tools de Productos

### 1. `listar_productos`

**Descripción**: Obtiene la lista completa de productos disponibles en el catálogo.

**Parámetros**: Ninguno

**Ejemplo de uso**:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "listar_productos",
    "arguments": {}
  },
  "id": 1
}
```

**Respuesta**:
```json
[
  {
    "idProducto": "uuid-123",
    "nombreProducto": "Laptop HP",
    "descripcion": "Laptop con procesador i5",
    "precio": 899.99,
    "stock": 15,
    "disponible": true
  }
]
```

---

### 2. `buscar_producto`

**Descripción**: Busca un producto específico por su ID único.

**Parámetros**:
- `id` (string, requerido): ID del producto (UUID)

**Ejemplo de uso**:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "buscar_producto",
    "arguments": {
      "id": "uuid-123"
    }
  },
  "id": 2
}
```

---

### 3. `buscar_productos_por_nombre`

**Descripción**: Busca productos cuyo nombre contenga el texto especificado.

**Parámetros**:
- `nombre` (string, requerido): Texto a buscar

**Ejemplo de uso en lenguaje natural**:
- "Busca productos que se llamen Laptop"
- "Muéstrame todos los productos con la palabra Mouse"

---

### 4. `crear_producto`

**Descripción**: Crea un nuevo producto en el catálogo.

**Parámetros**:
- `nombreProducto` (string, requerido): Nombre del producto
- `descripcion` (string, opcional): Descripción del producto
- `precio` (number, requerido): Precio en dólares (>= 0)
- `stock` (number, requerido): Cantidad disponible (>= 0)
- `imagenURL` (string, opcional): URL de la imagen
- `idCategoria` (number, opcional): ID de categoría

**Ejemplo en lenguaje natural**:
- "Crea un producto llamado Monitor Samsung, precio $299, stock 25"
- "Agrega un nuevo producto: Teclado mecánico, $79.99, 30 unidades"

---

### 5. `actualizar_producto`

**Descripción**: Actualiza información de un producto existente.

**Parámetros**:
- `id` (string, requerido): ID del producto
- Campos opcionales: `nombreProducto`, `descripcion`, `precio`, `stock`

**Ejemplo en lenguaje natural**:
- "Actualiza el stock del producto abc-123 a 50 unidades"
- "Cambia el precio del producto xyz-456 a $199.99"

---

### 6. `eliminar_producto`

**Descripción**: Elimina permanentemente un producto.

**Parámetros**:
- `id` (string, requerido): ID del producto

**Ejemplo en lenguaje natural**:
- "Elimina el producto con ID abc-123"

---

## 📦 Tools de Órdenes

### 7. `listar_ordenes`

**Descripción**: Obtiene todas las órdenes de compra.

**Parámetros**: Ninguno

**Ejemplo en lenguaje natural**:
- "Muéstrame todas las órdenes"
- "Lista las órdenes de compra"

---

### 8. `buscar_orden`

**Descripción**: Busca una orden específica por ID.

**Parámetros**:
- `id` (string, requerido): ID de la orden

---

### 9. `crear_orden`

**Descripción**: Crea una nueva orden de compra. Verifica stock y calcula total automáticamente.

**Parámetros**:
- `idProducto` (string, requerido): ID del producto
- `cantidad` (number, requerido): Cantidad a ordenar (>= 1)
- `nombreCliente` (string, opcional): Nombre del cliente
- `emailCliente` (string, opcional): Email del cliente

**Ejemplo en lenguaje natural**:
- "Crea una orden de 5 unidades del producto abc-123"
- "Quiero ordenar 3 laptops, el producto es xyz-456"

**Validaciones**:
- ✅ Verifica que el producto existe
- ✅ Verifica stock suficiente
- ✅ Calcula total (precio × cantidad)
- ✅ Reduce stock automáticamente

---

### 10. `actualizar_estado_orden`

**Descripción**: Actualiza el estado de una orden.

**Parámetros**:
- `id` (string, requerido): ID de la orden
- `estado` (string, requerido): Nuevo estado (PENDING, COMPLETED, CANCELLED)

**Ejemplo en lenguaje natural**:
- "Marca la orden abc-123 como completada"
- "Cancela la orden xyz-456"

---

## 🎯 Ejemplos de Conversación con Gemini

### Ejemplo 1: Listar y crear producto
```
Usuario: "Hola, muéstrame los productos disponibles"
Gemini: [Ejecuta listar_productos]
        "Aquí están los productos disponibles:
         1. Laptop HP - $899.99 (Stock: 15)
         2. Mouse Logitech - $29.99 (Stock: 50)"

Usuario: "Crea un producto nuevo: Monitor LG 27", precio $350, stock 10"
Gemini: [Ejecuta crear_producto]
        "He creado el producto 'Monitor LG 27' exitosamente.
         ID: abc-123, Precio: $350, Stock: 10"
```

### Ejemplo 2: Crear orden
```
Usuario: "Quiero hacer una orden de 3 laptops HP"
Gemini: [Ejecuta buscar_productos_por_nombre("Laptop HP")]
        [Ejecuta crear_orden con idProducto + cantidad]
        "Orden creada exitosamente.
         - Producto: Laptop HP
         - Cantidad: 3 unidades
         - Total: $2,699.97
         - Estado: PENDING
         - Stock restante: 12"
```

### Ejemplo 3: Manejo de errores
```
Usuario: "Ordena 100 unidades del producto abc-123"
Gemini: [Ejecuta crear_orden]
        "Lo siento, no puedo completar la orden.
         Stock insuficiente: Disponible 15, Solicitado: 100"
```

---

## 🔧 Arquitectura JSON-RPC 2.0

### Request Format
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "nombre_del_tool",
    "arguments": { ... }
  },
  "id": 1
}
```

### Response Format (Éxito)
```json
{
  "jsonrpc": "2.0",
  "result": { ... },
  "id": 1
}
```

### Response Format (Error)
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32603,
    "message": "Internal error",
    "data": "Detalles del error"
  },
  "id": 1
}
```

---

## ✅ Validaciones Implementadas

1. **Parámetros requeridos**: Se valida que todos los parámetros obligatorios estén presentes
2. **Tipos de datos**: Se valida que los tipos coincidan con el schema
3. **Stock**: Se verifica disponibilidad antes de crear órdenes
4. **Existencia**: Se verifica que productos/órdenes existan antes de operaciones

---

## 📊 Códigos de Error JSON-RPC

| Código | Significado |
|--------|-------------|
| -32600 | Invalid Request |
| -32601 | Method not found |
| -32602 | Invalid params |
| -32603 | Internal error |

---

**Última actualización**: Enero 2026  
**Autor**: [Tu nombre]  
**Curso**: Aplicación para el Servidor Web - ULEAM

# 🧪 Pruebas Documentadas - Taller 3 MCP

Esta guía contiene ejemplos de pruebas que puedes ejecutar con **Postman** o **Thunder Client** para validar el funcionamiento del sistema.

---

## 📋 Configuración Inicial

### Postman Collection Import

Puedes importar esta colección en Postman:

**Endpoint base**: `http://localhost:3000`

---

## ✅ Prueba 1: Listar Productos

**Objetivo**: Obtener todos los productos disponibles mediante lenguaje natural.

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Muéstrame todos los productos disponibles"
}
```

### Expected Response
```json
{
  "response": "Actualmente no hay productos en el catálogo. Puedes crear algunos usando el comando de crear producto.",
  "timestamp": "2026-01-06T..."
}
```

---

## ✅ Prueba 2: Crear Producto

**Objetivo**: Crear un nuevo producto con todos los datos necesarios.

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Crea un producto llamado 'Laptop HP Pavilion', descripción 'Laptop con procesador Intel i5', precio 899.99, stock 15"
}
```

### Expected Response
```json
{
  "response": "He creado el producto 'Laptop HP Pavilion' exitosamente. ID: [uuid], Precio: $899.99, Stock: 15 unidades.",
  "toolsCalled": [
    {
      "name": "crear_producto",
      "arguments": {
        "nombreProducto": "Laptop HP Pavilion",
        "descripcion": "Laptop con procesador Intel i5",
        "precio": 899.99,
        "stock": 15
      },
      "result": {
        "idProducto": "uuid-generado",
        "nombreProducto": "Laptop HP Pavilion",
        "precio": 899.99,
        "stock": 15
      }
    }
  ],
  "timestamp": "2026-01-06T..."
}
```

**✓ Validación**: Verificar que el producto fue creado con todos los campos correctos.

---

## ✅ Prueba 3: Crear Múltiples Productos

### Request 1: Mouse
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Agrega un Mouse Logitech MX Master, precio $79.99, stock 50"
}
```

### Request 2: Teclado
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Crea un teclado mecánico RGB, precio $129.99, stock 30"
}
```

### Request 3: Monitor
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Nuevo producto: Monitor Samsung 27 pulgadas, $299, 20 unidades disponibles"
}
```

**✓ Validación**: El sistema debe crear 3 productos diferentes con información única.

---

## ✅ Prueba 4: Listar Productos (Después de crear)

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Lista todos los productos que tenemos"
}
```

### Expected Response
```json
{
  "response": "Aquí están los productos disponibles:\n\n1. Laptop HP Pavilion - $899.99 (Stock: 15)\n2. Mouse Logitech MX Master - $79.99 (Stock: 50)\n3. Teclado mecánico RGB - $129.99 (Stock: 30)\n4. Monitor Samsung 27 pulgadas - $299.00 (Stock: 20)",
  "toolsCalled": [
    {
      "name": "listar_productos",
      "arguments": {},
      "result": [...]
    }
  ],
  "timestamp": "2026-01-06T..."
}
```

**✓ Validación**: Debe mostrar todos los productos creados previamente.

---

## ✅ Prueba 5: Buscar Producto por Nombre

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Busca productos que contengan la palabra Laptop"
}
```

### Expected Response
```json
{
  "response": "Encontré 1 producto con 'Laptop':\n- Laptop HP Pavilion ($899.99, Stock: 15)",
  "toolsCalled": [
    {
      "name": "buscar_productos_por_nombre",
      "arguments": {
        "nombre": "Laptop"
      },
      "result": [...]
    }
  ]
}
```

**✓ Validación**: Solo debe retornar productos cuyo nombre contenga "Laptop".

---

## ✅ Prueba 6: Buscar Producto por ID

**Nota**: Primero necesitas obtener un ID válido de la Prueba 4.

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Muéstrame los detalles del producto con ID [reemplazar-con-id-real]"
}
```

### Expected Response
```json
{
  "response": "Producto encontrado:\nNombre: Laptop HP Pavilion\nPrecio: $899.99\nStock: 15\nDescripción: Laptop con procesador Intel i5",
  "toolsCalled": [
    {
      "name": "buscar_producto",
      "arguments": {
        "id": "uuid-del-producto"
      },
      "result": {...}
    }
  ]
}
```

**✓ Validación**: Debe retornar todos los detalles del producto específico.

---

## ✅ Prueba 7: Crear Orden Simple

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Crea una orden de 2 laptops HP Pavilion"
}
```

### Expected Response
```json
{
  "response": "Orden creada exitosamente:\n- Producto: Laptop HP Pavilion\n- Cantidad: 2 unidades\n- Total: $1,799.98\n- Estado: PENDING\n- Stock restante: 13",
  "toolsCalled": [
    {
      "name": "buscar_productos_por_nombre",
      "arguments": { "nombre": "Laptop HP Pavilion" }
    },
    {
      "name": "crear_orden",
      "arguments": {
        "idProducto": "uuid-producto",
        "cantidad": 2
      },
      "result": {
        "idOrden": "uuid-orden",
        "total": 1799.98,
        "estado": "PENDING"
      }
    }
  ]
}
```

**✓ Validación**:
- El total debe ser correcto (precio × cantidad)
- El stock debe reducirse automáticamente
- La orden debe tener estado PENDING

---

## ✅ Prueba 8: Crear Orden con Cliente

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Crea una orden de 1 mouse para el cliente Juan Pérez, email juan@email.com"
}
```

### Expected Response
```json
{
  "response": "Orden creada para Juan Pérez (juan@email.com):\n- Producto: Mouse Logitech MX Master\n- Cantidad: 1\n- Total: $79.99",
  "toolsCalled": [...]
}
```

**✓ Validación**: La orden debe incluir nombre y email del cliente.

---

## ✅ Prueba 9: Error - Stock Insuficiente

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Ordena 100 laptops HP"
}
```

### Expected Response
```json
{
  "response": "Lo siento, no puedo completar la orden. Stock insuficiente: Disponible 13, Solicitado: 100",
  "toolsCalled": [
    {
      "name": "crear_orden",
      "result": {
        "error": "Stock insuficiente..."
      }
    }
  ]
}
```

**✓ Validación**: El sistema debe detectar y reportar stock insuficiente sin crear la orden.

---

## ✅ Prueba 10: Listar Órdenes

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Muéstrame todas las órdenes realizadas"
}
```

### Expected Response
```json
{
  "response": "Estas son las órdenes:\n\n1. Orden #abc-123 - Laptop HP Pavilion (2 unidades) - Total: $1,799.98 - Estado: PENDING\n2. Orden #xyz-456 - Mouse Logitech (1 unidad) - Total: $79.99 - Estado: PENDING",
  "toolsCalled": [
    {
      "name": "listar_ordenes",
      "result": [...]
    }
  ]
}
```

**✓ Validación**: Debe mostrar todas las órdenes creadas con sus detalles.

---

## ✅ Prueba 11: Actualizar Producto

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Actualiza el precio del Mouse Logitech a $69.99"
}
```

### Expected Response
```json
{
  "response": "Producto actualizado exitosamente. Nuevo precio: $69.99",
  "toolsCalled": [
    {
      "name": "buscar_productos_por_nombre",
      "arguments": { "nombre": "Mouse Logitech" }
    },
    {
      "name": "actualizar_producto",
      "arguments": {
        "id": "uuid-producto",
        "precio": 69.99
      }
    }
  ]
}
```

**✓ Validación**: El precio debe actualizarse correctamente.

---

## ✅ Prueba 12: Actualizar Stock

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Aumenta el stock del teclado mecánico a 50 unidades"
}
```

**✓ Validación**: El stock debe actualizarse a 50.

---

## ✅ Prueba 13: Actualizar Estado de Orden

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Marca la orden [id-orden] como completada"
}
```

### Expected Response
```json
{
  "response": "Orden actualizada a estado: COMPLETED",
  "toolsCalled": [
    {
      "name": "actualizar_estado_orden",
      "arguments": {
        "id": "uuid-orden",
        "estado": "COMPLETED"
      }
    }
  ]
}
```

**✓ Validación**: El estado debe cambiar de PENDING a COMPLETED.

---

## ✅ Prueba 14: Eliminar Producto

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Elimina el producto Monitor Samsung"
}
```

### Expected Response
```json
{
  "response": "Producto 'Monitor Samsung 27 pulgadas' eliminado exitosamente.",
  "toolsCalled": [...]
}
```

**✓ Validación**: El producto ya no debe aparecer al listar productos.

---

## ✅ Prueba 15: Conversación Compleja

**Objetivo**: Gemini debe ejecutar múltiples Tools en secuencia.

### Request
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Busca el producto Mouse Logitech, y si está disponible, crea una orden de 3 unidades para María González"
}
```

### Expected Response
Gemini debe:
1. Ejecutar `buscar_productos_por_nombre`
2. Verificar disponibilidad
3. Ejecutar `crear_orden` con los datos del cliente

**✓ Validación**: Gemini debe tomar decisiones inteligentes basándose en resultados intermedios.

---

## 📊 Resumen de Validaciones

| # | Prueba | Estado | Notas |
|---|--------|--------|-------|
| 1 | Listar productos (vacío) | ⬜ | |
| 2 | Crear producto individual | ⬜ | |
| 3 | Crear múltiples productos | ⬜ | |
| 4 | Listar productos (con datos) | ⬜ | |
| 5 | Buscar por nombre | ⬜ | |
| 6 | Buscar por ID | ⬜ | |
| 7 | Crear orden simple | ⬜ | |
| 8 | Crear orden con cliente | ⬜ | |
| 9 | Error: Stock insuficiente | ⬜ | |
| 10 | Listar órdenes | ⬜ | |
| 11 | Actualizar precio | ⬜ | |
| 12 | Actualizar stock | ⬜ | |
| 13 | Actualizar estado orden | ⬜ | |
| 14 | Eliminar producto | ⬜ | |
| 15 | Conversación compleja | ⬜ | |

---

## 📸 Capturas Requeridas

Para la entrega del taller, documenta con capturas:

1. ✅ Request y Response de cada prueba
2. ✅ Sección `toolsCalled` mostrando Tools ejecutados
3. ✅ Logs de la consola mostrando el flujo completo
4. ✅ Base de datos SQLite mostrando los datos persistidos

---

## 🔧 Troubleshooting

### Error: "GEMINI_API_KEY no configurada"
- Solución: Configura tu API Key en `api-gateway/.env`

### Error: "No se pudo conectar con MCP Server"
- Solución: Verifica que MCP Server esté corriendo en puerto 3001

### Error: "Producto no encontrado"
- Solución: Asegúrate de usar IDs válidos obtenidos de respuestas previas

---

**Autor**: [Tu nombre]  
**Fecha**: Enero 2026  
**Curso**: Aplicación para el Servidor Web - ULEAM

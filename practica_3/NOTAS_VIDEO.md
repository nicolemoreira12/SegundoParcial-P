# 📝 Notas para el Video Demostrativo (3-5 minutos)

Guión sugerido para el video de demostración del Taller 3.

---

## 🎬 Estructura del Video

### Introducción (30 segundos)
- "Hola, en este video voy a demostrar el Taller 3 de Aplicación para el Servidor Web"
- "Sistema de microservicios con Model Context Protocol y Gemini AI"
- Mostrar diagrama de arquitectura del README

---

### 1. Arquitectura del Sistema (1 minuto)

**Mostrar en pantalla**:
```
📱 Usuario (Postman)
    ↓ Lenguaje Natural
🌐 API Gateway + Gemini AI (Puerto 3000)
    ↓ JSON-RPC 2.0
🔧 MCP Server (Puerto 3001)
    ↓ HTTP REST
📦 Backend NestJS (Puerto 3002) + SQLite
```

**Explicar**:
- "Tenemos 3 capas"
- "El usuario habla en lenguaje natural"
- "Gemini AI interpreta y decide qué Tools ejecutar"
- "MCP Server expone Tools con JSON-RPC 2.0"
- "Backend maneja la lógica de negocio y base de datos"

---

### 2. Demostración en Vivo (2-3 minutos)

#### Escenario 1: Crear Producto (30 seg)
```json
POST http://localhost:3000/chat
{
  "message": "Crea un producto Laptop HP, precio 899, stock 10"
}
```

**Mostrar**:
- Request en Postman
- Response con `toolsCalled`
- Logs de la consola mostrando el flujo
- Terminal del MCP Server ejecutando el Tool

**Explicar**:
- "Gemini entiende la solicitud"
- "Ejecuta el Tool crear_producto"
- "El producto se guarda en SQLite"

---

#### Escenario 2: Listar Productos (20 seg)
```json
POST http://localhost:3000/chat
{
  "message": "Muéstrame todos los productos"
}
```

**Mostrar**:
- Response formateada en lenguaje natural
- Gemini convirtiendo datos JSON a texto legible

---

#### Escenario 3: Crear Orden (40 seg)
```json
POST http://localhost:3000/chat
{
  "message": "Crea una orden de 2 laptops para Juan Pérez"
}
```

**Mostrar**:
- Gemini ejecutando **múltiples Tools** en secuencia:
  1. `buscar_productos_por_nombre` (Laptop)
  2. `crear_orden` con el ID encontrado
- Stock del producto reducido automáticamente
- Cálculo automático del total

**Explicar**:
- "Gemini toma decisiones inteligentes"
- "Primero busca el producto, luego crea la orden"
- "Todo automático sin intervención manual"

---

#### Escenario 4: Error - Stock Insuficiente (30 seg)
```json
POST http://localhost:3000/chat
{
  "message": "Ordena 100 laptops"
}
```

**Mostrar**:
- Mensaje de error en lenguaje natural
- Validación de stock funcionando

**Explicar**:
- "El sistema valida reglas de negocio"
- "Gemini comunica errores de forma clara"

---

### 3. Arquitectura JSON-RPC 2.0 (30 seg)

**Mostrar en Postman**:
```json
POST http://localhost:3001/jsonrpc
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "params": {},
  "id": 1
}
```

**Mostrar Response**:
- Lista de 10 Tools disponibles
- Cada Tool con schema JSON

**Explicar**:
- "MCP Server implementa JSON-RPC 2.0"
- "Protocolo estándar para comunicación"
- "Validación automática de parámetros"

---

### 4. Código Destacado (30 seg)

**Mostrar brevemente**:
- [api-gateway/src/chat/gemini.service.ts](api-gateway/src/chat/gemini.service.ts#L40-L60) - Loop de Function Calling
- [mcp-server/src/tools.ts](mcp-server/src/tools.ts#L1-L30) - Definición de Tools con JSON Schema
- [backend/src/producto/producto.entity.ts](backend/src/producto/producto.entity.ts#L1-L20) - Entidades relacionadas

**Explicar**:
- "Uso de TypeScript en toda la arquitectura"
- "TypeORM para ORM con SQLite"
- "Function Calling de Gemini"

---

### 5. Base de Datos (20 seg)

**Mostrar**:
- Abrir `backend/database.sqlite` con DB Browser
- Mostrar tablas `productos` y `ordenes`
- Relación entre tablas

---

### Conclusión (20 seg)

**Resumen**:
- ✅ "Sistema funcional con 3 capas"
- ✅ "10 Tools implementados"
- ✅ "Gemini AI ejecuta Tools automáticamente"
- ✅ "Validación de reglas de negocio"
- ✅ "JSON-RPC 2.0 cumple con especificación"

**Cierre**:
- "Gracias por ver la demostración"
- "Código disponible en GitHub"

---

## 🎥 Tips para el Video

### Preparación
1. ✅ Cierra pestañas innecesarias del navegador
2. ✅ Aumenta tamaño de fuente en VS Code
3. ✅ Usa tema claro o con buen contraste
4. ✅ Prepara Postman con todas las requests
5. ✅ Reinicia servicios antes de grabar

### Durante la Grabación
1. ✅ Habla claro y pausado
2. ✅ No uses muletillas ("ehh", "este")
3. ✅ Muestra resultados completos
4. ✅ Explica mientras muestras código
5. ✅ Usa zoom cuando sea necesario

### Software Recomendado
- 🎥 **OBS Studio** (gratuito, profesional)
- 🎥 **ShareX** (captura rápida)
- 🎥 **Camtasia** (edición)
- 🎤 **Audacity** (mejorar audio si es necesario)

### Checklist Final
- [ ] Audio claro (sin ruido)
- [ ] Video en HD (1080p mínimo)
- [ ] Duración 3-5 minutos
- [ ] Muestra todas las capas funcionando
- [ ] Explica arquitectura claramente
- [ ] Demuestra Tools en acción
- [ ] Muestra manejo de errores

---

## 📊 Script Detallado (Copiar/Pegar)

```
[0:00-0:30] INTRODUCCIÓN
"Hola, en este video voy a demostrar el Taller 3 de Aplicación para el Servidor Web.
Implementé un sistema de microservicios que integra Model Context Protocol con Gemini AI.
El sistema permite gestionar productos y órdenes usando lenguaje natural."

[0:30-1:00] ARQUITECTURA
"La arquitectura tiene 3 capas:
1. API Gateway con Gemini AI en puerto 3000 - procesa lenguaje natural
2. MCP Server en puerto 3001 - expone Tools con JSON-RPC 2.0
3. Backend NestJS en puerto 3002 - CRUD con SQLite
El flujo es: Usuario → Gemini → MCP → Backend"

[1:00-1:30] DEMO - CREAR PRODUCTO
"Voy a crear un producto usando lenguaje natural.
Envío: 'Crea un producto Laptop HP, precio 899, stock 10'
Como ven, Gemini interpretó mi solicitud y ejecutó el Tool crear_producto.
El producto se guardó en la base de datos SQLite."

[1:30-1:50] DEMO - LISTAR
"Ahora listo los productos: 'Muéstrame todos los productos'
Gemini convierte los datos JSON a texto legible.
Vemos el producto que acabamos de crear."

[1:50-2:30] DEMO - CREAR ORDEN
"Creo una orden: 'Crea una orden de 2 laptops para Juan Pérez'
Observen que Gemini ejecuta DOS Tools:
1. Primero busca el producto por nombre
2. Luego crea la orden con el ID encontrado
El stock se reduce automáticamente de 10 a 8.
El total se calcula solo: $1,799.98"

[2:30-3:00] DEMO - ERROR
"Ahora un caso de error: 'Ordena 100 laptops'
El sistema detecta stock insuficiente y Gemini lo comunica claramente.
Las validaciones funcionan correctamente."

[3:00-3:30] JSON-RPC
"El MCP Server implementa JSON-RPC 2.0.
Aquí están los 10 Tools disponibles con sus schemas JSON.
Cada Tool define parámetros requeridos y opcionales."

[3:30-4:00] CÓDIGO
"Brevemente el código:
- Gemini Service implementa Function Calling
- Tools definidos con JSON Schema
- Entidades relacionadas con TypeORM"

[4:00-4:20] BASE DE DATOS
"Aquí la base de datos SQLite.
Tablas productos y órdenes con relación.
Todos los datos persistidos correctamente."

[4:20-4:40] CONCLUSIÓN
"En resumen:
- Sistema funcional de 3 capas
- 10 Tools implementados
- Gemini ejecuta Tools automáticamente
- Validaciones de negocio
- JSON-RPC 2.0 cumple especificación
Gracias por ver. Código en GitHub."
```

---

**Duración total**: ~4:30 minutos  
**Ideal para**: Demostración académica completa

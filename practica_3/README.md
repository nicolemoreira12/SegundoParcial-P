# 🤖 Taller 3: Model Context Protocol (MCP) + Microservicios

Sistema de microservicios con integración de Model Context Protocol (MCP) y Gemini AI para orquestación inteligente de servicios mediante lenguaje natural.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-4285F4?style=flat&logo=google&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## 📋 Descripción del Proyecto

Sistema de 3 capas que integra **Model Context Protocol (MCP)** para permitir que Gemini AI interactúe con microservicios backend mediante **Function Calling** y **JSON-RPC 2.0**.

### ✨ Características Principales

1. **🤖 Integración con Gemini AI**
   - Procesamiento de lenguaje natural
   - Function Calling para invocar Tools
   - Conversación contextual

2. **🔧 MCP Server**
   - Protocolo JSON-RPC 2.0
   - Tools definidos con JSON Schema
   - Validación automática de parámetros

3. **📦 Backend Microservicios**
   - CRUD de Productos y Órdenes
   - Base de datos SQLite
   - TypeORM para persistencia

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────┐
│           👤 Usuario (Postman/Frontend)        │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Lenguaje Natural
                  ▼
┌─────────────────────────────────────────────────┐
│     🌐 API Gateway + Gemini AI (Puerto 3000)   │
│  • Recibe texto del usuario                     │
│  • Gemini analiza y decide qué Tools ejecutar  │
│  • Ejecuta Tools automáticamente vía JSON-RPC   │
└─────────────────┬───────────────────────────────┘
                  │
                  │ JSON-RPC 2.0
                  ▼
┌─────────────────────────────────────────────────┐
│         🔧 MCP Server (Puerto 3001)            │
│  • Expone Tools (listar_libros, buscar_libro)  │
│  • Valida parámetros con JSON Schema           │
│  • Delega al Backend vía HTTP                  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTP REST
                  ▼
┌─────────────────────────────────────────────────┐
│      📦 Backend NestJS (Puerto 3002)           │
│  • CRUD de entidades (Productos, Órdenes)      │
│  • Base de datos SQLite                        │
└─────────────────────────────────────────────────┘
```

---

## 📦 Componentes del Sistema

### 1. **Backend NestJS** (Puerto 3002)
- **Responsabilidad**: CRUD de entidades de negocio
- **Tecnología**: NestJS + TypeORM + SQLite
- **Entidades**:
  - `Producto`: Gestión de productos
  - `Orden`: Gestión de órdenes de compra
- **Endpoints REST**:
  - `GET /productos` - Listar todos los productos
  - `GET /productos/:id` - Buscar producto por ID
  - `POST /productos` - Crear nuevo producto
  - `PUT /productos/:id` - Actualizar producto
  - `DELETE /productos/:id` - Eliminar producto
  - `GET /ordenes` - Listar todas las órdenes
  - `POST /ordenes` - Crear nueva orden

### 2. **MCP Server** (Puerto 3001)
- **Responsabilidad**: Exponer Tools mediante JSON-RPC 2.0
- **Tecnología**: TypeScript + Express
- **Protocolo**: JSON-RPC 2.0
- **Tools Disponibles**:
  ```typescript
  {
    name: "listar_productos",
    description: "Obtiene la lista completa de productos disponibles",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  }
  
  {
    name: "buscar_producto",
    description: "Busca un producto específico por su ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID del producto" }
      },
      required: ["id"]
    }
  }
  
  {
    name: "crear_producto",
    description: "Crea un nuevo producto en el catálogo",
    inputSchema: {
      type: "object",
      properties: {
        nombreProducto: { type: "string" },
        descripcion: { type: "string" },
        precio: { type: "number" },
        stock: { type: "number" }
      },
      required: ["nombreProducto", "precio", "stock"]
    }
  }
  
  {
    name: "crear_orden",
    description: "Crea una nueva orden de compra",
    inputSchema: {
      type: "object",
      properties: {
        idProducto: { type: "string" },
        cantidad: { type: "number" }
      },
      required: ["idProducto", "cantidad"]
    }
  }
  ```

### 3. **API Gateway + Gemini AI** (Puerto 3000)
- **Responsabilidad**: Procesar lenguaje natural y orquestar Tools
- **Tecnología**: NestJS + @google/generative-ai
- **Modelo**: Gemini 2.0 Flash (gratuito)
- **Flujo**:
  1. Usuario envía prompt en lenguaje natural
  2. Gemini analiza el texto y decide qué Tools ejecutar
  3. Gateway ejecuta Tools vía JSON-RPC al MCP Server
  4. Gemini recibe resultados y genera respuesta natural

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js >= 18.x
- npm >= 9.x
- Docker y Docker Compose (opcional)
- API Key de Gemini (gratuita en [Google AI Studio](https://aistudio.google.com))

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd practica_3
```

### 2. Configurar variables de entorno

Crear archivos `.env` en cada microservicio:

**backend/.env**
```env
PORT=3002
DATABASE_PATH=./database.sqlite
```

**mcp-server/.env**
```env
PORT=3001
BACKEND_URL=http://localhost:3002
```

**api-gateway/.env**
```env
PORT=3000
GEMINI_API_KEY=tu_api_key_aqui
MCP_SERVER_URL=http://localhost:3001
```

### 3. Instalar dependencias

```bash
# Backend
cd backend
npm install

# MCP Server
cd ../mcp-server
npm install

# API Gateway
cd ../api-gateway
npm install
```

### 4. Iniciar servicios

**Opción A: Con Docker Compose**
```bash
docker-compose up -d
```

**Opción B: Manual**
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - MCP Server
cd mcp-server
npm run dev

# Terminal 3 - API Gateway
cd api-gateway
npm run start:dev
```

---

## 🎯 Ejemplos de Uso

### Ejemplo 1: Listar productos
```bash
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Muéstrame todos los productos disponibles"
}
```

**Respuesta:**
```json
{
  "response": "Aquí están los productos disponibles:\n\n1. Laptop HP - $899.99 (Stock: 15)\n2. Mouse Logitech - $29.99 (Stock: 50)\n3. Teclado Mecánico - $79.99 (Stock: 30)"
}
```

### Ejemplo 2: Crear producto
```bash
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Quiero crear un nuevo producto: Monitor Samsung de 27 pulgadas, precio $299, stock 20"
}
```

### Ejemplo 3: Crear orden
```bash
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Crea una orden de 3 unidades del producto con ID abc-123"
}
```

---

## 📊 Flujo de Ejecución

### Ejemplo: "Quiero prestar el libro 'Clean Code' para Juan Pérez"

1. **Usuario → API Gateway**
   - Envía: `{ "message": "Quiero prestar el libro 'Clean Code' para Juan Pérez" }`

2. **API Gateway → Gemini**
   - Envía prompt + Tools disponibles
   - Gemini analiza y decide:
     - Tool: `buscar_libro`
     - Params: `{ "titulo": "Clean Code" }`

3. **API Gateway → MCP Server**
   - JSON-RPC Request:
   ```json
   {
     "jsonrpc": "2.0",
     "method": "tools/call",
     "params": {
       "name": "buscar_libro",
       "arguments": { "titulo": "Clean Code" }
     },
     "id": 1
   }
   ```

4. **MCP Server → Backend**
   - `GET http://localhost:3002/libros?titulo=Clean Code`

5. **Backend → MCP Server**
   - Retorna: `{ "id": "libro_123", "titulo": "Clean Code", "disponible": true }`

6. **MCP Server → API Gateway**
   - JSON-RPC Response con resultado

7. **Gemini → API Gateway**
   - Decide ejecutar segundo Tool: `registrar_prestamo`
   - Params: `{ "idLibro": "libro_123", "nombreEstudiante": "Juan Pérez" }`

8. **API Gateway → Usuario**
   - Respuesta natural: "El libro 'Clean Code' ha sido prestado exitosamente a Juan Pérez. Fecha de devolución: 15/01/2026"

---

## 🧪 Pruebas

Las pruebas deben documentarse con capturas de pantalla en Postman o Thunder Client mostrando:

1. ✅ Listar productos mediante lenguaje natural
2. ✅ Buscar producto específico
3. ✅ Crear nuevo producto
4. ✅ Crear orden de compra
5. ✅ Manejo de errores (producto no existe, stock insuficiente)

---

## 📚 Tecnologías y Recursos

### Stack Tecnológico

| Componente    | Tecnología                      | Puerto |
|---------------|---------------------------------|--------|
| Backend       | NestJS + TypeORM + SQLite       | 3002   |
| MCP Server    | TypeScript + Express + JSON-RPC | 3001   |
| API Gateway   | NestJS + @google/generative-ai  | 3000   |
| Modelo IA     | Gemini 2.0 Flash (gratuito)     | API Cloud |

### Recursos de Referencia

- **Documentación MCP**: https://www.modelcontextprotocol.io
- **Especificación JSON-RPC 2.0**: https://www.jsonrpc.org/specification
- **Gemini AI Studio**: https://aistudio.google.com
- **NestJS Documentation**: https://docs.nestjs.com

---

## 👥 Autores

- **Estudiantes**: [Nombres de los integrantes del grupo]
- **Docente**: Ing. John Cevallos
- **Materia**: Aplicación para el Servidor Web
- **Universidad**: ULEAM - Facultad de Ciencias Informáticas

---

## 📄 Licencia

Este proyecto es parte del Taller 3 de la materia "Aplicación para el Servidor Web" - ULEAM 2025-2026.

# 📑 Índice General del Proyecto - Taller 3 MCP

Guía de navegación rápida para todos los archivos y documentación del proyecto.

---

## 📂 Estructura del Proyecto

```
practica_3/
├── 📖 README.md                    ← Documentación principal
├── 📖 INSTALACION.md               ← Guía de instalación paso a paso
├── 🧪 PRUEBAS.md                   ← 15 pruebas documentadas
├── 📚 DOCUMENTACION_TOOLS.md       ← Documentación de los 10 Tools
├── 🎬 NOTAS_VIDEO.md               ← Guión para video demostrativo
├── 📦 postman-collection.json      ← Colección de Postman
├── 🐳 docker-compose.yml           ← Orquestación con Docker
├── 🔧 install.ps1                  ← Script de instalación (Windows)
├── 🔧 install.sh                   ← Script de instalación (Linux/Mac)
├── 🚫 .gitignore                   ← Archivos ignorados por Git
├── 🔐 .env                         ← Variables de entorno (GEMINI_API_KEY)
│
├── backend/                        ← 📦 Backend NestJS (Puerto 3002)
│   ├── src/
│   │   ├── main.ts                 ← Entry point
│   │   ├── app.module.ts           ← Módulo principal
│   │   ├── producto/
│   │   │   ├── producto.entity.ts  ← Entidad Producto
│   │   │   ├── producto.dto.ts     ← DTOs de validación
│   │   │   ├── producto.service.ts ← Lógica de negocio
│   │   │   ├── producto.controller.ts ← REST endpoints
│   │   │   └── producto.module.ts  ← Módulo de productos
│   │   └── orden/
│   │       ├── orden.entity.ts     ← Entidad Orden
│   │       ├── orden.dto.ts        ← DTOs
│   │       ├── orden.service.ts    ← Lógica con validaciones
│   │       ├── orden.controller.ts ← REST endpoints
│   │       └── orden.module.ts     ← Módulo de órdenes
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── Dockerfile
│   └── .env
│
├── mcp-server/                     ← 🔧 MCP Server (Puerto 3001)
│   ├── src/
│   │   ├── index.ts                ← Entry point + Express
│   │   ├── types.ts                ← TypeScript types
│   │   ├── tools.ts                ← Definición de 10 Tools
│   │   ├── jsonrpc-handler.ts      ← Manejador JSON-RPC 2.0
│   │   └── backend-service.ts      ← Cliente HTTP al Backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env
│
└── api-gateway/                    ← 🌐 API Gateway (Puerto 3000)
    ├── src/
    │   ├── main.ts                 ← Entry point
    │   ├── app.module.ts           ← Módulo principal
    │   └── chat/
    │       ├── chat.module.ts      ← Módulo de chat
    │       ├── chat.controller.ts  ← POST /chat endpoint
    │       ├── chat.service.ts     ← Orquestación
    │       ├── chat.dto.ts         ← Request/Response DTOs
    │       ├── gemini.service.ts   ← Integración con Gemini AI
    │       └── mcp.service.ts      ← Cliente JSON-RPC al MCP
    ├── package.json
    ├── tsconfig.json
    ├── nest-cli.json
    ├── Dockerfile
    └── .env                        ← ⚠️ GEMINI_API_KEY aquí
```

---

## 📖 Guías de Lectura Recomendadas

### Para Empezar
1. **[README.md](./README.md)** - Comienza aquí
2. **[INSTALACION.md](./INSTALACION.md)** - Instala el proyecto
3. **[PRUEBAS.md](./PRUEBAS.md)** - Ejecuta pruebas

### Para Entender la Arquitectura
1. **[README.md](./README.md#arquitectura-del-sistema)** - Diagrama de arquitectura
2. **[DOCUMENTACION_TOOLS.md](./DOCUMENTACION_TOOLS.md)** - Tools disponibles
3. **Código fuente**: Backend → MCP → API Gateway

### Para el Video
1. **[NOTAS_VIDEO.md](./NOTAS_VIDEO.md)** - Guión completo

---

## 🔍 Referencias Rápidas

### Endpoints Principales

| Servicio | URL | Descripción |
|----------|-----|-------------|
| API Gateway | `http://localhost:3000/chat` | Endpoint principal (POST) |
| MCP Server | `http://localhost:3001/jsonrpc` | JSON-RPC 2.0 |
| MCP Health | `http://localhost:3001/health` | Health check |
| Backend Productos | `http://localhost:3002/productos` | CRUD productos |
| Backend Órdenes | `http://localhost:3002/ordenes` | CRUD órdenes |

---

### Tools Disponibles (10)

**Productos**:
1. `listar_productos`
2. `buscar_producto`
3. `buscar_productos_por_nombre`
4. `crear_producto`
5. `actualizar_producto`
6. `eliminar_producto`

**Órdenes**:
7. `listar_ordenes`
8. `buscar_orden`
9. `crear_orden`
10. `actualizar_estado_orden`

Ver detalles en: [DOCUMENTACION_TOOLS.md](./DOCUMENTACION_TOOLS.md)

---

## 🚀 Comandos Rápidos

### Instalación
```bash
# Automático (Windows)
.\install.ps1

# Automático (Linux/Mac)
chmod +x install.sh
./install.sh

# Manual
cd backend && npm install
cd ../mcp-server && npm install
cd ../api-gateway && npm install
```

### Iniciar Servicios
```bash
# Terminal 1
cd backend && npm run start:dev

# Terminal 2
cd mcp-server && npm run dev

# Terminal 3
cd api-gateway && npm run start:dev
```

### Docker
```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

---

## 🎯 Flujo de Desarrollo

### 1. Primera Vez
1. Leer [README.md](./README.md)
2. Seguir [INSTALACION.md](./INSTALACION.md)
3. Obtener API Key de Gemini
4. Configurar `.env` en api-gateway
5. Instalar dependencias
6. Iniciar servicios

### 2. Pruebas
1. Importar [postman-collection.json](./postman-collection.json)
2. Seguir [PRUEBAS.md](./PRUEBAS.md)
3. Ejecutar las 15 pruebas
4. Documentar con capturas

### 3. Video
1. Leer [NOTAS_VIDEO.md](./NOTAS_VIDEO.md)
2. Preparar entorno
3. Grabar demostración (3-5 min)

---

## 📚 Tecnologías Usadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 18+ | Runtime |
| TypeScript | 5.3+ | Lenguaje |
| NestJS | 10.0+ | Framework Backend |
| Express | 4.18+ | Framework MCP Server |
| TypeORM | 0.3+ | ORM |
| SQLite | 3.x | Base de datos |
| Gemini AI | 2.0 Flash | Modelo IA |
| Docker | Latest | Contenedores |

---

## 🔗 Enlaces Útiles

### Documentación Oficial
- [NestJS](https://docs.nestjs.com)
- [TypeORM](https://typeorm.io)
- [Gemini AI](https://ai.google.dev/tutorials/node_quickstart)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification)

### Recursos del Curso
- **Proyecto base**: [Practica1](../Proyecto-Nivia/Practica1/)
- **Entidades**: [Entities](../Proyecto-Nivia/Entities/)

---

## ✅ Checklist de Entregables

### Código
- [ ] Repositorio Git con código completo
- [ ] Estructura de carpetas especificada
- [ ] 2 entidades relacionadas (Producto, Orden)
- [ ] Endpoints REST funcionales
- [ ] Base de datos SQLite operativa

### MCP Server
- [ ] JSON-RPC 2.0 implementado
- [ ] 10 Tools definidos con JSON Schema
- [ ] Validación de parámetros
- [ ] Comunicación con Backend

### API Gateway
- [ ] Integración con Gemini AI
- [ ] Function Calling funcionando
- [ ] Manejo de múltiples Tools
- [ ] Respuestas en lenguaje natural

### Documentación
- [ ] README.md completo
- [ ] INSTALACION.md con pasos claros
- [ ] PRUEBAS.md con 15 pruebas
- [ ] DOCUMENTACION_TOOLS.md detallada
- [ ] Capturas de Postman/Thunder Client

### Video
- [ ] Duración 3-5 minutos
- [ ] Muestra arquitectura completa
- [ ] Demuestra flujo end-to-end
- [ ] Explica Tools en acción
- [ ] Muestra manejo de errores

### Docker
- [ ] docker-compose.yml funcional
- [ ] Dockerfiles en cada servicio
- [ ] Variables de entorno configuradas

---

## 🆘 Soporte

### Problemas Comunes
Ver sección Troubleshooting en:
- [INSTALACION.md](./INSTALACION.md#troubleshooting)
- [PRUEBAS.md](./PRUEBAS.md#troubleshooting)

### Preguntas Frecuentes

**P: ¿Dónde consigo la API Key de Gemini?**  
R: https://aistudio.google.com/app/apikey (gratis)

**P: ¿Qué puerto usa cada servicio?**  
R: Backend=3002, MCP=3001, Gateway=3000

**P: ¿Cómo sé que funciona correctamente?**  
R: Ejecuta las 15 pruebas de PRUEBAS.md

**P: ¿Necesito Docker?**  
R: No, puedes iniciar manualmente con npm

**P: ¿Cuántas entidades necesito?**  
R: Mínimo 2 relacionadas (tenemos Producto y Orden)

---

## 👥 Información del Proyecto

- **Taller**: Nº 3
- **Materia**: Aplicación para el Servidor Web
- **Docente**: Ing. John Cevallos
- **Universidad**: ULEAM - Facultad de Ciencias Informáticas
- **Período**: 2025-2026 (2)
- **Modalidad**: Grupal (3 estudiantes)

---

## 📄 Licencia

Este proyecto es parte del contenido académico del Taller 3 - ULEAM 2026.

---

**Última actualización**: Enero 2026  
**Versión**: 1.0.0

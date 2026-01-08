# ⚡ Guía Rápida de Instalación - Taller 3 MCP

Guía paso a paso para instalar y ejecutar el sistema de microservicios con MCP.

---

## 📋 Prerrequisitos

Asegúrate de tener instalado:

- ✅ **Node.js** >= 18.x ([Descargar](https://nodejs.org/))
- ✅ **npm** >= 9.x (incluido con Node.js)
- ✅ **Git** ([Descargar](https://git-scm.com/))
- ✅ **Docker Desktop** (opcional) ([Descargar](https://www.docker.com/products/docker-desktop/))

---

## 🔑 Paso 1: Obtener API Key de Gemini (GRATIS)

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"**
4. Copia la API Key generada

**Nota**: La API de Gemini 2.0 Flash es completamente gratuita.

---

## 📥 Paso 2: Clonar el Proyecto

```bash
git clone <url-del-repositorio>
cd practica_3
```

---

## ⚙️ Paso 3: Configurar Variables de Entorno

### Backend
```bash
cd backend
cp .env .env.local
# Editar backend/.env si es necesario
```

### MCP Server
```bash
cd ../mcp-server
cp .env .env.local
# Editar mcp-server/.env si es necesario
```

### API Gateway (IMPORTANTE)
```bash
cd ../api-gateway
cp .env .env.local
# Editar api-gateway/.env
```

**Edita `api-gateway/.env` y reemplaza**:
```env
GEMINI_API_KEY=tu_api_key_real_aqui
```

---

## 📦 Paso 4: Instalar Dependencias

Ejecuta en cada carpeta:

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

---

## 🚀 Paso 5: Iniciar Servicios

### Opción A: Manual (Recomendado para desarrollo)

Abre **3 terminales** diferentes:

**Terminal 1 - Backend**
```bash
cd backend
npm run start:dev
```
Espera ver: `🚀 Backend corriendo en http://localhost:3002`

**Terminal 2 - MCP Server**
```bash
cd mcp-server
npm run dev
```
Espera ver: `🔧 MCP Server corriendo en http://localhost:3001`

**Terminal 3 - API Gateway**
```bash
cd api-gateway
npm run start:dev
```
Espera ver: `🌐 API Gateway corriendo en http://localhost:3000`

---

### Opción B: Docker Compose (Producción)

**Paso 1**: Configura API Key en `.env` raíz
```bash
# En la raíz de practica_3/
echo "GEMINI_API_KEY=tu_api_key_aqui" > .env
```

**Paso 2**: Inicia servicios
```bash
docker-compose up -d
```

**Paso 3**: Verifica estado
```bash
docker-compose ps
```

Debes ver 3 contenedores corriendo:
- ✅ `backend` (puerto 3002)
- ✅ `mcp-server` (puerto 3001)
- ✅ `api-gateway` (puerto 3000)

**Ver logs**:
```bash
docker-compose logs -f
```

**Detener servicios**:
```bash
docker-compose down
```

---

## ✅ Paso 6: Verificar Instalación

### Test 1: Backend
```bash
curl http://localhost:3002/productos
```
**Esperado**: `[]` (lista vacía)

### Test 2: MCP Server
```bash
curl http://localhost:3001/health
```
**Esperado**: `{"status":"ok",...}`

### Test 3: API Gateway + Gemini
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hola, ¿estás funcionando?\"}"
```
**Esperado**: Respuesta de Gemini en lenguaje natural

---

## 🎯 Paso 7: Primera Prueba Real

**Con Postman o Thunder Client**:

```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Crea un producto llamado Laptop HP, precio 899, stock 10"
}
```

**Respuesta esperada**:
```json
{
  "response": "He creado el producto 'Laptop HP' exitosamente. ID: [uuid], Precio: $899, Stock: 10.",
  "toolsCalled": [
    {
      "name": "crear_producto",
      "arguments": {...},
      "result": {...}
    }
  ],
  "timestamp": "2026-01-06T..."
}
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@nestjs/core'"
```bash
cd backend  # o api-gateway
rm -rf node_modules package-lock.json
npm install
```

### Error: "GEMINI_API_KEY no configurada"
- Verifica que copiaste la API Key correctamente en `api-gateway/.env`
- Reinicia el servicio API Gateway

### Error: "ECONNREFUSED localhost:3002"
- Verifica que Backend esté corriendo en puerto 3002
- Revisa los logs del Backend

### Error: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Logs no aparecen en Docker
```bash
docker-compose logs api-gateway
docker-compose logs mcp-server
docker-compose logs backend
```

---

## 📊 Estructura de Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Backend | 3002 | http://localhost:3002 |
| MCP Server | 3001 | http://localhost:3001 |
| API Gateway | 3000 | http://localhost:3000 |

---

## 🔄 Comandos Útiles

### Desarrollo
```bash
# Ver logs en tiempo real
npm run start:dev

# Compilar proyecto
npm run build

# Ejecutar producción
npm run start:prod
```

### Docker
```bash
# Reconstruir imágenes
docker-compose build

# Reiniciar un servicio
docker-compose restart api-gateway

# Ver logs de un servicio
docker-compose logs -f backend

# Eliminar todo
docker-compose down -v
```

---

## 📚 Siguiente Paso

Ve a [PRUEBAS.md](./PRUEBAS.md) para ejecutar las 15 pruebas documentadas.

---

**¿Problemas?** Revisa los logs de cada servicio o consulta [DOCUMENTACION_TOOLS.md](./DOCUMENTACION_TOOLS.md)

**Autor**: [Tu nombre]  
**Fecha**: Enero 2026

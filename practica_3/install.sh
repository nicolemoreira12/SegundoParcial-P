#!/bin/bash

echo "========================================"
echo "  TALLER 3 - MCP + GEMINI AI"
echo "  Instalador Automático"
echo "========================================"
echo ""

# Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado. Instala Node.js desde https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js instalado: $NODE_VERSION"

# Verificar npm
NPM_VERSION=$(npm --version)
echo "✅ npm instalado: $NPM_VERSION"
echo ""

# Instalar Backend
echo "📦 Instalando Backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error instalando Backend"
    exit 1
fi
echo "✅ Backend instalado"
cd ..

# Instalar MCP Server
echo "📦 Instalando MCP Server..."
cd mcp-server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error instalando MCP Server"
    exit 1
fi
echo "✅ MCP Server instalado"
cd ..

# Instalar API Gateway
echo "📦 Instalando API Gateway..."
cd api-gateway
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error instalando API Gateway"
    exit 1
fi
echo "✅ API Gateway instalado"
cd ..

echo ""
echo "========================================"
echo "  ✅ INSTALACIÓN COMPLETADA"
echo "========================================"
echo ""
echo "⚠️  IMPORTANTE: Configura tu GEMINI_API_KEY"
echo "    1. Ve a https://aistudio.google.com/app/apikey"
echo "    2. Crea una API Key"
echo "    3. Edita api-gateway/.env y pega tu API Key"
echo ""
echo "🚀 Para iniciar los servicios:"
echo "    Terminal 1: cd backend && npm run start:dev"
echo "    Terminal 2: cd mcp-server && npm run dev"
echo "    Terminal 3: cd api-gateway && npm run start:dev"
echo ""
echo "📚 Documentación: README.md"
echo "🧪 Pruebas: PRUEBAS.md"
echo ""

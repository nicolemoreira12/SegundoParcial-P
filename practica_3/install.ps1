# Script de instalación automática para Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TALLER 3 - MCP + GEMINI AI" -ForegroundColor Cyan
Write-Host "  Instalador Automatico" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js no encontrado. Instala Node.js desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green

# Verificar npm
$npmVersion = npm --version 2>$null
Write-Host "✅ npm instalado: $npmVersion" -ForegroundColor Green
Write-Host ""

# Instalar Backend
Write-Host "📦 Instalando Backend..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando Backend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend instalado" -ForegroundColor Green
Set-Location ..

# Instalar MCP Server
Write-Host "📦 Instalando MCP Server..." -ForegroundColor Yellow
Set-Location mcp-server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando MCP Server" -ForegroundColor Red
    exit 1
}
Write-Host "✅ MCP Server instalado" -ForegroundColor Green
Set-Location ..

# Instalar API Gateway
Write-Host "📦 Instalando API Gateway..." -ForegroundColor Yellow
Set-Location api-gateway
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando API Gateway" -ForegroundColor Red
    exit 1
}
Write-Host "✅ API Gateway instalado" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ INSTALACION COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Configura tu GEMINI_API_KEY" -ForegroundColor Yellow
Write-Host "    1. Ve a https://aistudio.google.com/app/apikey" -ForegroundColor White
Write-Host "    2. Crea una API Key" -ForegroundColor White
Write-Host "    3. Edita api-gateway/.env y pega tu API Key" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Para iniciar los servicios:" -ForegroundColor Cyan
Write-Host "    Terminal 1: cd backend && npm run start:dev" -ForegroundColor White
Write-Host "    Terminal 2: cd mcp-server && npm run dev" -ForegroundColor White
Write-Host "    Terminal 3: cd api-gateway && npm run start:dev" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentación: README.md" -ForegroundColor Cyan
Write-Host "🧪 Pruebas: PRUEBAS.md" -ForegroundColor Cyan
Write-Host ""

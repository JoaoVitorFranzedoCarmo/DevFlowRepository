@echo off
REM ===========================================================================
REM DevFlow - Startup Script para Windows
REM ===========================================================================

echo.
echo ================================================
echo   DevFlow - Setup e Startup
echo ================================================
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker não está instalado ou não está no PATH
    echo.
    echo Instale Docker Desktop em: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker encontrado
echo.

REM Mudar para diretório do projeto
cd /d "%~dp0"

echo ================================================
echo   INICIANDO BACKEND COM DOCKER
echo ================================================
echo.
echo 📦 Iniciando containers...
echo.

cd Back\prisma

REM Verificar se containers já estão rodando
docker compose ps >nul 2>&1
if %ERRORLEVEL% EQ 0 (
    echo ⚠️  Containers já estão rodando
    echo Parando containers antigos...
    docker compose down >nul 2>&1
)

REM Iniciar docker compose em background
start "DevFlow Backend" cmd /k "docker compose up --build"

echo.
echo ⏳ Aguardando backend inicializar (30 segundos)...
timeout /t 30 /nobreak

echo.
echo ================================================
echo   POPULANDO BANCO DE DADOS
echo ================================================
echo.

docker compose exec api npm run prisma:seed

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Erro ao rodar seed. Tentando alternativa...
    docker compose exec api npx ts-node prisma/seed.ts
)

echo.
echo ================================================
echo   INICIANDO FRONTEND
echo ================================================
echo.

REM Voltar para raiz
cd /d "%~dp0"

REM Instalar dependências se não existirem
if not exist "node_modules" (
    echo 📦 Instalando dependências do Frontend...
    call npm install
)

echo.
echo 🚀 Iniciando servidor de desenvolvimento...
echo.

start "DevFlow Frontend" cmd /k "npm run dev"

echo.
echo ================================================
echo   ✅ SETUP COMPLETO!
echo ================================================
echo.
echo 🌐 URLs:
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:3001
echo.
echo 🔓 Credenciais de Teste:
echo   Email: joao.vitor@pucpr.edu.br
echo   Senha: 123456
echo.
echo   (ou)
echo   Email: leander.hallu@pucpr.edu.br
echo   Senha: 123456
echo.
echo ================================================
echo.

pause

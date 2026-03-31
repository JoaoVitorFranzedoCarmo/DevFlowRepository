# 🚀 3 Formas de Rodar DevFlow

Escolha a opção que funcionar melhor para você:

---

## 📌 OPÇÃO 1: Script Automático (Mais Fácil)

**Pré-requisito:** Docker Desktop rodando

Clique duas vezes em:
```
start-devflow.bat
```

✅ Isso abre 3 terminais automaticamente com:
- Backend rodando
- Seed executado
- Frontend rodando

Acesse: http://localhost:5173

---

## 🎯 OPÇÃO 2: Terminal Manual (Recomendado para Desenvolvimento)

**Abra o VS Code** (Ctrl + ` para abrir terminal integrado)

### Terminal 1 - Backend:
```bash
cd Back\prisma
docker compose up --build
```

Aguarde ver: `Server running on http://localhost:3001`

### Terminal 2 - Database Seed (novo terminal):
```bash
cd Back\prisma
docker compose exec api npm run prisma:seed
```

### Terminal 3 - Frontend (novo terminal):
```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

---

## 🔧 OPÇÃO 3: VS Code Tasks (Mais Integrado)

1. **Copie** o arquivo `tasks.json` para a pasta `.vscode/` do projeto
2. No VS Code, pressione `Ctrl + Shift + B`
3. Selecione a tarefa desejada:
   - `🐳 Backend - Docker Up`
   - `🌱 Backend - Database Seed`
   - `⚛️ Frontend - Install & Dev`

---

## ✅ Como Saber que Está Funcionando

### Backend (http://localhost:3001)
```
✅ "Server running on http://localhost:3001"
```

### Frontend (http://localhost:5173)
```
➜  Local:   http://localhost:5173
```

### Login no App
```
Email: joao.vitor@pucpr.edu.br
Senha: 123456
```

---

## ❌ Se Não Funcionar

### Problema: "Docker daemon not running"
**Solução:** Abra Docker Desktop e aguarde inicializar (ícone da baleia no canto inferior)

### Problema: "docker-compose: command not found"
**Solução:** Use `docker compose` (sem hífen) em vez de `docker-compose`

### Problema: "Cannot connect to backend"
**Solução:** Verifique se a API está rodando em http://localhost:3001 (Terminal 1)

### Problema: "Port already in use"
```bash
# Matando processo na porta 3001:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Matando processo na porta 5173:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Problema: "Database connection refused"
```bash
# Reset completo:
cd Back\prisma
docker compose down -v
docker compose up --build
docker compose exec api npm run prisma:seed
```

---

## 📚 Próximos Passos

1. ✅ Frontend e Backend rodando
2. 🔓 Acesse http://localhost:5173
3. 📝 Explore a aplicação
4. 📖 Leia o `copilot-instructions.md` para entender a arquitetura
5. 🛠️ Comece a desenvolver!

---

## 💡 Dicas Profissionais

### Visualizar Banco de Dados
```bash
cd Back\prisma
docker compose exec api npm run prisma:studio
```
Abre interface web: http://localhost:5555

### Ver Logs do Backend
```bash
cd Back\prisma
docker compose logs -f api
```

### Resetar Banco Completamente
```bash
cd Back\prisma
docker compose down -v          # Remove containers e volumes
docker compose up --build       # Reconstrói tudo
docker compose exec api npm run prisma:seed
```

### Desenvolver Offline (sem Docker)
```bash
cd Back\prisma
npm install
npm run dev
```
⚠️ Requer PostgreSQL local instalado

---

**Bom desenvolvimento! 🎉**

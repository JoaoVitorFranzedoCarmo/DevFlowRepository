# 🚀 Guia de Setup - DevFlow

## ⚙️ Pré-requisitos

✅ Docker Desktop instalado e rodando  
✅ Node.js 18+ instalado  
✅ Git instalado  

---

## 📋 Passos para Rodar o Projeto

### **OPÇÃO 1: Com Docker (Recomendado)**

#### Passo 1️⃣: Inicie o Backend
Abra um terminal na pasta do projeto e execute:

```bash
cd Back\prisma
docker compose up --build
```

**Aguarde até ver estas mensagens:**
```
database-1  | ready to accept connections
api-1 | Server running on http://localhost:3001
```

#### Passo 2️⃣: Popule o Banco de Dados (novo terminal)
```bash
cd Back\prisma
docker compose exec api npm run prisma:seed
```

**Você verá:**
```
✅ Seed completed successfully!
```

#### Passo 3️⃣: Inicie o Frontend (novo terminal)
```bash
npm install
npm run dev
```

**Você verá:**
```
➜  Local:   http://localhost:5173
```

---

### **OPÇÃO 2: Sem Docker (Alternativa)**

#### Pré-requisitos adicionais:
- PostgreSQL 14+ instalado e rodando
- Variável de ambiente `DATABASE_URL` configurada

#### Passo 1: Backend
```bash
cd Back\prisma
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

#### Passo 2: Frontend
```bash
npm install
npm run dev
```

---

## 🔓 Credenciais de Teste

Após o seed, use essas credenciais no login:

| Usuário | Email | Senha |
|---------|-------|-------|
| Gerente | joao.vitor@pucpr.edu.br | 123456 |
| Dev | leander.hallu@pucpr.edu.br | 123456 |

---

## 🌐 URLs da Aplicação

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| Swagger/Docs | http://localhost:3001/api/docs (se implementado) |

---

## ❌ Troubleshooting

### Docker não conecta
```bash
# Verifique se Docker Desktop está rodando
docker ps

# Se não funcionar, reinicie:
docker-compose down
docker compose up --build
```

### Erro: "database is locked"
```bash
# Limpe os containers e volumes
docker compose down -v
docker compose up --build
```

### Seed não funciona
```bash
# Tente executar diretamente no container
docker compose exec api ts-node prisma/seed.ts

# Ou via npm script
docker compose exec api npm run prisma:seed
```

### Frontend não conecta na API
- Verifique se o backend está rodando em http://localhost:3001
- Confira a variável `CORS_ORIGIN` no docker-compose.yml
- Limpe cache: Ctrl+Shift+Delete no browser

---

## 📂 Estrutura do Projeto

```
DevFlowRepository/
├── Front/                    # React + Vite
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── Back/prisma/             # Express + TypeScript
│   ├── src/
│   ├── prisma/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── package.json
├── .github/
│   └── copilot-instructions.md
└── SETUP.md                 # Este arquivo
```

---

## 🔧 Scripts Úteis

### Backend

```bash
cd Back\prisma

npm run dev              # Desenvolvimento com hot reload
npm run build            # Compilar TypeScript
npm start                # Rodar versão compilada
npm run prisma:migrate   # Criar/atualizar banco
npm run prisma:seed      # Popular com dados iniciais
npm run prisma:studio    # Abrir UI do Prisma
```

### Frontend

```bash
npm run dev              # Desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview da build
```

---

## 💡 Dicas

1. **Mantenha 3 terminais abertos** durante desenvolvimento:
   - Terminal 1: Backend (`docker compose up`)
   - Terminal 2: Seed (executado 1x)
   - Terminal 3: Frontend (`npm run dev`)

2. **Se o banco corromper**, limpe tudo:
   ```bash
   docker compose down -v
   docker compose up --build
   docker compose exec api npm run prisma:seed
   ```

3. **Acesse o Prisma Studio** para visualizar o banco:
   ```bash
   docker compose exec api npm run prisma:studio
   ```

---

## 📞 Suporte

Se encontrar problemas:
1. Veja a seção **Troubleshooting** acima
2. Verifique se Docker Desktop está rodando
3. Limpe cache e containers: `docker system prune -a`
4. Reinicie Docker Desktop

---

**Bom desenvolvimento! 🚀**

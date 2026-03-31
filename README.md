# DevFlow 🚀

> Sistema de Gestão de Equipes de Desenvolvimento

Uma plataforma completa para gerenciar componentes, tarefas, documentação e lições aprendidas de equipes de desenvolvimento de software.

---

## 📌 Comece Aqui!

### ⚡ Startup Rápido

**Opção 1: Clique duas vezes**
```
start-devflow.bat
```

**Opção 2: Terminal (recomendado)**
```bash
# Terminal 1
cd Back\prisma
docker compose up --build

# Terminal 2 (depois que backend iniciar)
cd Back\prisma
docker compose exec api npm run prisma:seed

# Terminal 3
npm install
npm run dev
```

Acesse: **http://localhost:5173**

### 🔐 Credenciais Padrão
```
Email: joao.vitor@pucpr.edu.br
Senha: 123456
```

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [**QUICK-START.md**](./QUICK-START.md) | 3 formas de rodar o projeto |
| [**SETUP.md**](./SETUP.md) | Guia completo de instalação |
| [**copilot-instructions.md**](./.github/copilot-instructions.md) | Instruções para IA assistentes |
| [**Front/README.md**](./Front/README.md) | Arquitetura do Frontend |
| [**Back/prisma/README.md**](./Back/prisma/README.md) | Arquitetura do Backend + API |

---

## 🎯 O que é DevFlow?

DevFlow é um sistema de gestão de equipes que oferece:

### 📦 **Biblioteca de Componentes**
- Catálogo centralizado de componentes reutilizáveis
- Categorias, tags e busca avançada
- Estatísticas de uso e avaliações

### 📋 **Kanban de Tarefas**
- Visualização por status: Backlog → Afazer → Progresso → Revisão → Concluído
- Priorização com matriz de urgência/importância
- Atribuição e datas de entrega

### 📚 **Lições Aprendidas**
- Registrar aprendizados do projeto
- Compartilhar conhecimento entre equipes

### 📄 **Documentação**
- Gestão de versões de documentos
- Rastreamento de atualização

### 🔗 **Integrações**
- Configurar integrações externas
- Notificações personalizadas

---

## 🏗️ Arquitetura

### Frontend
- **Framework:** React 18
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Autenticação:** JWT (localStorage)

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Linguagem:** TypeScript
- **Banco:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT (access + refresh tokens)
- **Validação:** Zod
- **Containerização:** Docker

---

## 🚀 Scripts Disponíveis

### Frontend
```bash
npm run dev       # Desenvolvimento com hot reload
npm run build     # Build para produção
npm run preview   # Preview da build
```

### Backend
```bash
cd Back\prisma

npm run dev              # Desenvolvimento
npm run build            # Compilação TypeScript
npm start                # Produção
npm run prisma:migrate   # Migrations do banco
npm run prisma:seed      # Popular dados iniciais
npm run prisma:studio    # UI do banco de dados
```

---

## 🔧 Estrutura do Projeto

```
DevFlowRepository/
├── Front/                          # Frontend React
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── data/
│   │   ├── icons/
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── Back/prisma/                    # Backend Express + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
├── .github/
│   └── copilot-instructions.md     # Para assistentes IA
│
├── QUICK-START.md                  # ⭐ Comece aqui
├── SETUP.md                        # Instalação completa
├── start-devflow.bat               # Script automático
└── package.json                    # Frontend root
```

---

## 📡 URLs Padrão

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |
| Prisma Studio | http://localhost:5555 |

---

## 🔓 Seed Data

Após executar o seed, você tem acesso a:

### Usuários
- **João Vitor Franze** (GERENTE) - joao.vitor@pucpr.edu.br
- **Leander Reblin Hallu** (DESENVOLVEDOR) - leander.hallu@pucpr.edu.br

Senha padrão: `123456`

### Dados de Exemplo
- Componentes com categorias e tags
- Tarefas em diferentes status
- Lições aprendidas
- Documentos e versões
- Templates

---

## ⚙️ Variáveis de Ambiente

### Backend (Back/prisma/.env)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://devflow:devflow123@localhost:5432/devflow_db?schema=public
JWT_SECRET=devflow-jwt-secret-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=devflow-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

---

## 🐛 Troubleshooting

### Docker não funciona
```bash
# Verifique Docker Desktop
docker ps

# Se não funcionar, reinicie
docker-compose down
docker compose up --build
```

### Porta já em uso
```bash
# Encontrar processo
netstat -ano | findstr :3001

# Matar processo
taskkill /PID <PID> /F
```

### Banco de dados corrompido
```bash
cd Back\prisma
docker compose down -v
docker compose up --build
docker compose exec api npm run prisma:seed
```

---

## 📖 Próximas Etapas

1. ✅ Clonar/abrir este repositório
2. 🚀 Seguir [QUICK-START.md](./QUICK-START.md)
3. 🔐 Fazer login em http://localhost:5173
4. 🎨 Explorar a interface
5. 💻 Começar a desenvolver!

---

## 📝 Convenções de Código

Veja [copilot-instructions.md](./.github/copilot-instructions.md) para:
- Padrões de arquitetura
- Padrões de API
- Autenticação e autorização
- Validação e erro handling
- Estrutura de banco de dados

---

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
2. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
3. Push para a branch (`git push origin feature/MinhaFeature`)
4. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado.

---

**Desenvolvido com ❤️ por João Vitor Franze**

Para dúvidas, veja [QUICK-START.md](./QUICK-START.md) 🚀

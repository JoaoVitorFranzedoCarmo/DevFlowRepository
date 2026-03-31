# 🎯 DevFlow - Guia Rápido em Português

## ✨ JEITO MAIS FÁCIL (Recomendado!)

### 1️⃣ Certifique-se que Docker Desktop está aberto
- Procure o ícone da baleia 🐳 na bandeja (canto inferior direito)
- Se não estiver aberto, clique em Docker Desktop

### 2️⃣ Clique 2 vezes em:
```
start-devflow.bat
```

### 3️⃣ Aguarde:
- 3 terminais devem abrir automaticamente
- Backend iniciando...
- Banco de dados sendo populado...
- Frontend iniciando...

### 4️⃣ Acesse no navegador:
```
http://localhost:5173
```

### 5️⃣ Faça login:
```
Email: joao.vitor@pucpr.edu.br
Senha: 123456
```

---

## 🖥️ JEITO MANUAL (Desenvolvimento)

Se o .bat não funcionar, faça manualmente:

### Terminal 1 (não fecha este):
```bash
cd Back\prisma
docker compose up --build
```

Aguarde aparecer:
```
✅ Server running on http://localhost:3001
```

### Terminal 2 (novo, após Terminal 1 inicializar):
```bash
cd Back\prisma
docker compose exec api npm run prisma:seed
```

Aguarde aparecer:
```
✅ Seed completed
```

### Terminal 3 (novo, pode rodar em paralelo):
```bash
npm install
npm run dev
```

Aguarde aparecer:
```
➜ Local: http://localhost:5173
```

### Pronto! Acesse:
```
http://localhost:5173
```

---

## ❌ Não Funcionou? Respostas Rápidas

### "Docker não encontrado"
**Solução:** Abra Docker Desktop e aguarde 30 segundos até aparecer "Docker is running"

### "Connection refused"
**Solução:** Terminal 1 ainda não terminou de inicializar. Aguarde a mensagem "Server running"

### "Port already in use"
**Solução:** Feche a aplicação anterior ou use:
```bash
# Fechar porta 3001
netstat -ano | findstr :3001
taskkill /PID <NUMERO> /F

# Fechar porta 5173
netstat -ano | findstr :5173
taskkill /PID <NUMERO> /F
```

### "Database error"
**Solução:** Reset completo:
```bash
cd Back\prisma
docker compose down -v
docker compose up --build
docker compose exec api npm run prisma:seed
```

### "Não consegui fazer login"
**Solução:** Aguarde o seed finalizar completamente (ver resposta acima)

---

## ✅ Checklist para Confirmar que Está Funcionando

- [ ] Docker Desktop está aberto (ícone 🐳 na bandeja)
- [ ] Backend mostra: "Server running on http://localhost:3001"
- [ ] Seed mostra: "Seed completed successfully"
- [ ] Frontend mostra: "Local: http://localhost:5173"
- [ ] Consegue acessar http://localhost:5173 no navegador
- [ ] Consegue fazer login com joao.vitor@pucpr.edu.br / 123456
- [ ] Consegue ver dados na aplicação (componentes, tarefas, etc)

---

## 📚 Documentação Completa

Para mais detalhes, leia em ordem:

1. **QUICK-START.md** - 3 formas diferentes de rodar
2. **SETUP.md** - Instruções detalhadas
3. **README.md** - Overview da aplicação
4. **copilot-instructions.md** - Para assistentes IA

---

## 🆘 Ainda Não Funciona?

Tente isso em ordem:

```bash
# 1. Verificar Docker
docker ps

# 2. Parar tudo
cd Back\prisma
docker compose down

# 3. Limpar volumes (AVISO: Deleta dados!)
docker compose down -v

# 4. Reiniciar tudo
docker compose up --build

# 5. Repopular banco
docker compose exec api npm run prisma:seed
```

Se ainda não funcionar:

- 📖 Leia a seção "Troubleshooting" em **SETUP.md**
- 🐳 Verifique se Docker Desktop está mesmo rodando
- 💾 Reinicie seu computador
- 📱 Desinstale/reinstale Docker Desktop

---

## 🎉 Conseguiu Rodar?

Parabéns! 🚀

Agora você pode:

1. 🔐 Fazer login no app
2. 📦 Explorar Biblioteca de Componentes
3. 📋 Ver Kanban de Tarefas
4. 📚 Ler Lições Aprendidas
5. 📄 Gerenciar Documentação
6. 💻 Começar a desenvolver!

---

## 💡 Dicas Profissionais

### Ver Banco de Dados (UI Legal)
```bash
cd Back\prisma
docker compose exec api npm run prisma:studio
```
Abre: http://localhost:5555

### Ver Logs do Backend
```bash
cd Back\prisma
docker compose logs -f api
```

### Parar Tudo (Sem perder dados)
```bash
cd Back\prisma
docker compose down
```

### Parar Tudo (Deletando dados)
```bash
cd Back\prisma
docker compose down -v
```

---

**Bom desenvolvimento! 🎉**

Qualquer dúvida, releia este arquivo ou a documentação completa.

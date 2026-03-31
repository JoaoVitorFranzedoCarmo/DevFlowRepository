import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Clean existing data
  await prisma.taskDependency.deleteMany();
  await prisma.taskPrioritization.deleteMany();
  await prisma.documentVersion.deleteMany();
  await prisma.notificationSetting.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.template.deleteMany();
  await prisma.document.deleteMany();
  await prisma.task.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.component.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const hashedPassword = await bcrypt.hash("123456", 10);

  const joao = await prisma.user.create({
    data: {
      name: "João Vitor Franze",
      email: "joao.vitor@pucpr.edu.br",
      password: hashedPassword,
      role: "GERENTE",
      avatar: null,
    },
  });

  const leander = await prisma.user.create({
    data: {
      name: "Leander Reblin Hallu",
      email: "leander.hallu@pucpr.edu.br",
      password: hashedPassword,
      role: "DESENVOLVEDOR",
      avatar: null,
    },
  });

  console.log("✅ Usuários criados");

  // Components
  const components = await Promise.all([
    prisma.component.create({
      data: {
        name: "Sistema de Autenticação JWT",
        desc: "Login, registro e refresh token com JWT. Inclui middleware de proteção de rotas e gestão de sessão.",
        category: "Autenticação",
        lang: "Node.js",
        authorId: joao.id,
        uses: 8,
        rating: 4.8,
        tags: ["JWT", "Auth", "Middleware"],
      },
    }),
    prisma.component.create({
      data: {
        name: "CRUD Genérico com Paginação",
        desc: "Componente reutilizável para operações CRUD com paginação server-side, filtros dinâmicos e ordenação.",
        category: "CRUD",
        lang: "React",
        authorId: leander.id,
        uses: 12,
        rating: 4.9,
        tags: ["CRUD", "Paginação", "REST"],
      },
    }),
    prisma.component.create({
      data: {
        name: "Dashboard de Métricas",
        desc: "Painel com gráficos de linha, barra e pizza usando Recharts. Inclui filtros de período e exportação PDF.",
        category: "Dashboard",
        lang: "React",
        authorId: joao.id,
        uses: 5,
        rating: 4.5,
        tags: ["Charts", "Recharts", "PDF"],
      },
    }),
    prisma.component.create({
      data: {
        name: "Integração GitHub API",
        desc: "Serviço completo para integração com GitHub REST API v3. Commits, PRs, issues e webhooks.",
        category: "Integração API",
        lang: "Node.js",
        authorId: leander.id,
        uses: 6,
        rating: 4.7,
        tags: ["GitHub", "REST", "Webhook"],
      },
    }),
    prisma.component.create({
      data: {
        name: "Formulário Dinâmico",
        desc: "Gerador de formulários baseado em JSON Schema com validação automática, masks e campos condicionais.",
        category: "Formulários",
        lang: "React",
        authorId: joao.id,
        uses: 15,
        rating: 4.9,
        tags: ["Forms", "Validation", "JSON Schema"],
      },
    }),
    prisma.component.create({
      data: {
        name: "Tabela Avançada com Filtros",
        desc: "Componente de tabela com busca, filtros por coluna, ordenação, seleção múltipla e ações em lote.",
        category: "UI Components",
        lang: "React",
        authorId: leander.id,
        uses: 10,
        rating: 4.6,
        tags: ["Table", "Filtros", "DataGrid"],
      },
    }),
  ]);

  console.log("✅ Componentes criados");

  // Lessons
  await Promise.all([
    prisma.lesson.create({
      data: {
        title: "JWT Refresh Token em Produção",
        project: "Sistema RH",
        desc: "Implementar rotação de refresh tokens para evitar roubo de sessão. Usar blacklist em Redis.",
        authorId: joao.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Paginação com Cursor vs Offset",
        project: "E-commerce API",
        desc: "Para datasets grandes (>100k registros), cursor-based pagination tem performance 10x melhor que offset.",
        authorId: leander.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Testes E2E com CI/CD",
        project: "DevFlow v0.5",
        desc: "Rodar testes E2E em containers Docker isolados no pipeline evita flaky tests por estado compartilhado.",
        authorId: joao.id,
      },
    }),
  ]);

  console.log("✅ Lições aprendidas criadas");

  // Tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: "Integração com Bitbucket",
        desc: "Implementar OAuth e sincronização de repositórios com Bitbucket",
        status: "BACKLOG",
        priority: "BAIXA",
        tags: ["Integração", "API"],
        dueDate: new Date("2026-03-28"),
        assigneeId: leander.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Exportação de relatórios em CSV",
        desc: "Permitir download de métricas e relatórios em formato CSV",
        status: "BACKLOG",
        priority: "MEDIA",
        tags: ["Relatórios"],
        dueDate: new Date("2026-03-30"),
        assigneeId: joao.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Tela de configurações do usuário",
        desc: "Permitir edição de perfil, tema e notificações",
        status: "AFAZER",
        priority: "MEDIA",
        tags: ["UI", "Configurações"],
        dueDate: new Date("2026-03-20"),
        assigneeId: leander.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Filtro avançado no Kanban",
        desc: "Filtrar tarefas por prioridade, responsável e tags",
        status: "AFAZER",
        priority: "ALTA",
        tags: ["Kanban", "Filtros"],
        dueDate: new Date("2026-03-19"),
        assigneeId: joao.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Notificações por e-mail",
        desc: "Enviar notificações quando tarefas são atribuídas ou vencem",
        status: "AFAZER",
        priority: "MEDIA",
        tags: ["Notificações"],
        dueDate: new Date("2026-03-22"),
        assigneeId: leander.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Sistema de autenticação RBAC",
        desc: "Controle de acesso por papéis: dev, líder, QA, gerente",
        status: "PROGRESSO",
        priority: "CRITICA",
        tags: ["Auth", "RBAC"],
        dueDate: new Date("2026-03-17"),
        assigneeId: joao.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Dashboard de métricas da sprint",
        desc: "Gráficos de burndown, velocity e distribuição de tarefas",
        status: "PROGRESSO",
        priority: "ALTA",
        tags: ["Dashboard", "Recharts"],
        dueDate: new Date("2026-03-18"),
        assigneeId: leander.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Geração automática de documentação",
        desc: "Gerar docs em HTML/PDF a partir de comentários do código",
        status: "REVISAO",
        priority: "ALTA",
        tags: ["Documentação", "OpenAPI"],
        dueDate: new Date("2026-03-16"),
        assigneeId: joao.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Tela de login e registro",
        desc: "Formulários de login, registro e recuperação de senha",
        status: "CONCLUIDO",
        priority: "CRITICA",
        tags: ["Auth", "UI"],
        dueDate: new Date("2026-03-10"),
        assigneeId: leander.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Componente de tabela reutilizável",
        desc: "Tabela com busca, filtros, ordenação e paginação",
        status: "CONCLUIDO",
        priority: "ALTA",
        tags: ["UI Components"],
        dueDate: new Date("2026-03-12"),
        assigneeId: joao.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Setup do projeto (Vite + Tailwind)",
        desc: "Configuração inicial do projeto React com Vite e Tailwind CSS",
        status: "CONCLUIDO",
        priority: "MEDIA",
        tags: ["Setup"],
        dueDate: new Date("2026-03-05"),
        assigneeId: leander.id,
      },
    }),
  ]);

  console.log("✅ Tarefas criadas");

  // Task Prioritizations
  const taskMap: Record<string, string> = {};
  tasks.forEach((t) => { taskMap[t.title] = t.id; });

  await Promise.all([
    prisma.taskPrioritization.create({
      data: { taskId: taskMap["Sistema de autenticação RBAC"], urgency: 5, importance: 5, value: 9, effort: 7, quadrant: "FAZER" },
    }),
    prisma.taskPrioritization.create({
      data: { taskId: taskMap["Dashboard de métricas da sprint"], urgency: 4, importance: 5, value: 8, effort: 6, quadrant: "FAZER" },
    }),
    prisma.taskPrioritization.create({
      data: { taskId: taskMap["Geração automática de documentação"], urgency: 4, importance: 4, value: 7, effort: 5, quadrant: "FAZER" },
    }),
    prisma.taskPrioritization.create({
      data: { taskId: taskMap["Filtro avançado no Kanban"], urgency: 3, importance: 4, value: 6, effort: 3, quadrant: "AGENDAR" },
    }),
    prisma.taskPrioritization.create({
      data: { taskId: taskMap["Tela de login e registro"], urgency: 5, importance: 5, value: 9, effort: 4, quadrant: "FAZER" },
    }),
    prisma.taskPrioritization.create({
      data: { taskId: taskMap["Notificações por e-mail"], urgency: 2, importance: 3, value: 5, effort: 4, quadrant: "AGENDAR" },
    }),
    prisma.taskPrioritization.create({
      data: { taskId: taskMap["Integração com Bitbucket"], urgency: 1, importance: 2, value: 4, effort: 6, quadrant: "ELIMINAR" },
    }),
    prisma.taskPrioritization.create({
      data: { taskId: taskMap["Exportação de relatórios em CSV"], urgency: 2, importance: 4, value: 5, effort: 2, quadrant: "AGENDAR" },
    }),
    prisma.taskPrioritization.create({
      data: { taskId: taskMap["Tela de configurações do usuário"], urgency: 2, importance: 3, value: 4, effort: 3, quadrant: "DELEGAR" },
    }),
    prisma.taskPrioritization.create({
      data: { taskId: taskMap["Componente de tabela reutilizável"], urgency: 3, importance: 5, value: 8, effort: 4, quadrant: "FAZER" },
    }),
  ]);

  console.log("✅ Priorizações criadas");

  // Task Dependencies
  await Promise.all([
    prisma.taskDependency.create({
      data: {
        sourceTaskId: taskMap["Sistema de autenticação RBAC"],
        targetTaskId: taskMap["Tela de login e registro"],
      },
    }),
    prisma.taskDependency.create({
      data: {
        sourceTaskId: taskMap["Notificações por e-mail"],
        targetTaskId: taskMap["Sistema de autenticação RBAC"],
      },
    }),
    prisma.taskDependency.create({
      data: {
        sourceTaskId: taskMap["Exportação de relatórios em CSV"],
        targetTaskId: taskMap["Dashboard de métricas da sprint"],
      },
    }),
    prisma.taskDependency.create({
      data: {
        sourceTaskId: taskMap["Tela de configurações do usuário"],
        targetTaskId: taskMap["Sistema de autenticação RBAC"],
      },
    }),
  ]);

  console.log("✅ Dependências criadas");

  // Documents
  const docs = await Promise.all([
    prisma.document.create({
      data: {
        title: "API de Autenticação",
        type: "OPENAPI",
        format: "HTML",
        version: "v2.3.1",
        codeVersion: "main@a3f7c2d",
        status: "ATUALIZADO",
        pages: 24,
        authorId: joao.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "Módulo de Priorização",
        type: "TECNICA",
        format: "PDF",
        version: "v1.8.0",
        codeVersion: "main@b12e4fa",
        status: "ATUALIZADO",
        pages: 18,
        authorId: leander.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "Serviço de Notificações",
        type: "OPENAPI",
        format: "HTML",
        version: "v1.2.0",
        codeVersion: "develop@8f3a1bc",
        status: "DESATUALIZADO",
        pages: 10,
        authorId: joao.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "Componentes de UI",
        type: "TECNICA",
        format: "HTML",
        version: "v3.1.2",
        codeVersion: "main@c44d9e1",
        status: "ATUALIZADO",
        pages: 32,
        authorId: leander.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "Manual do Usuário - DevFlow",
        type: "MANUAL",
        format: "PDF",
        version: "v1.0.0",
        codeVersion: "",
        status: "RASCUNHO",
        pages: 45,
        authorId: joao.id,
      },
    }),
    prisma.document.create({
      data: {
        title: "Integração GitHub API",
        type: "OPENAPI",
        format: "HTML",
        version: "v2.0.0",
        codeVersion: "main@f92b7a3",
        status: "ATUALIZADO",
        pages: 15,
        authorId: leander.id,
      },
    }),
  ]);

  console.log("✅ Documentos criados");

  // Document Versions
  await Promise.all([
    prisma.documentVersion.create({ data: { documentId: docs[0].id, version: "v2.3.1", commit: "a3f7c2d", changes: "Adicionados 2 novos endpoints de recuperação de senha", author: "João Vitor" } }),
    prisma.documentVersion.create({ data: { documentId: docs[0].id, version: "v2.3.0", commit: "e5b8f12", changes: "Implementado refresh token e logout", author: "João Vitor" } }),
    prisma.documentVersion.create({ data: { documentId: docs[3].id, version: "v3.1.2", commit: "c44d9e1", changes: "Novo componente DatePicker documentado", author: "Leander" } }),
    prisma.documentVersion.create({ data: { documentId: docs[1].id, version: "v1.8.0", commit: "b12e4fa", changes: "Documentação da Matriz de Eisenhower e Value vs Effort", author: "Leander" } }),
    prisma.documentVersion.create({ data: { documentId: docs[5].id, version: "v2.0.0", commit: "f92b7a3", changes: "Migração para GitHub API v4 (GraphQL)", author: "Leander" } }),
    prisma.documentVersion.create({ data: { documentId: docs[2].id, version: "v1.2.0", commit: "8f3a1bc", changes: "Endpoints de push notification adicionados", author: "João Vitor" } }),
  ]);

  console.log("✅ Versões de documentos criadas");

  // Templates
  await Promise.all([
    prisma.template.create({ data: { name: "Documentação Técnica", desc: "Gerada a partir de comentários do código (Javadoc, Docstring). Inclui classes, métodos, parâmetros e retornos.", icon: "code", uses: 18 } }),
    prisma.template.create({ data: { name: "API REST (OpenAPI)", desc: "Documentação interativa de API baseada em especificação OpenAPI/Swagger. Endpoints, schemas e exemplos.", icon: "api", uses: 14 } }),
    prisma.template.create({ data: { name: "Manual do Usuário", desc: "Guia de uso do sistema com capturas de tela, passo a passo e FAQ para usuários finais.", icon: "book", uses: 6 } }),
    prisma.template.create({ data: { name: "Documento de Arquitetura", desc: "Visão geral da arquitetura, diagramas de componentes, decisões técnicas e padrões adotados.", icon: "arch", uses: 4 } }),
    prisma.template.create({ data: { name: "Ata de Reunião", desc: "Registro de reuniões com participantes, pauta, decisões e ações definidas.", icon: "meeting", uses: 22 } }),
    prisma.template.create({ data: { name: "Release Notes", desc: "Notas de versão com features, correções, breaking changes e instruções de migração.", icon: "release", uses: 10 } }),
  ]);

  console.log("✅ Templates criados");

  // Integrations (for João)
  await Promise.all([
    prisma.integration.create({ data: { name: "GitHub", desc: "Repositórios, commits, PRs e issues", status: "conectado", icon: "github", userId: joao.id } }),
    prisma.integration.create({ data: { name: "GitLab", desc: "Repositórios e pipelines CI/CD", status: "desconectado", icon: "gitlab", userId: joao.id } }),
    prisma.integration.create({ data: { name: "Jira", desc: "Sincronização de tarefas e sprints", status: "desconectado", icon: "jira", userId: joao.id } }),
    prisma.integration.create({ data: { name: "Slack", desc: "Notificações e alertas em canais", status: "conectado", icon: "slack", userId: joao.id } }),
    prisma.integration.create({ data: { name: "Jenkins", desc: "Pipelines de CI/CD e builds", status: "desconectado", icon: "jenkins", userId: joao.id } }),
    prisma.integration.create({ data: { name: "SonarQube", desc: "Análise estática e qualidade de código", status: "desconectado", icon: "sonar", userId: joao.id } }),
  ]);

  console.log("✅ Integrações criadas");

  // Notification Settings (for João)
  const events = [
    { eventKey: "taskAssigned", email: true, push: true },
    { eventKey: "taskDue", email: true, push: true },
    { eventKey: "taskOverdue", email: true, push: false },
    { eventKey: "docGenerated", email: false, push: true },
    { eventKey: "buildFailed", email: true, push: true },
    { eventKey: "testFailed", email: true, push: true },
    { eventKey: "newComponent", email: false, push: false },
    { eventKey: "sprintEnd", email: true, push: true },
  ];

  await Promise.all(
    events.map((e) =>
      prisma.notificationSetting.create({
        data: { userId: joao.id, ...e },
      })
    )
  );

  console.log("✅ Configurações de notificação criadas");
  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📧 Credenciais de acesso:");
  console.log("   João Vitor: joao.vitor@pucpr.edu.br / 123456");
  console.log("   Leander:    leander.hallu@pucpr.edu.br / 123456");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

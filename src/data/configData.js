// src/data/configData.js

export const userProfile = {
  name: "João Vitor Franze",
  email: "joao.vitor@pucpr.edu.br",
  role: "Gerente de Projeto",
  avatar: "JV",
  team: "DevFlow",
};

export const teamMembers = [
  { name: "João Vitor Franze", email: "joao.vitor@pucpr.edu.br", role: "Gerente de Projeto", avatar: "JV", status: "ativo" },
  { name: "Leander Reblin Hallu", email: "leander.hallu@pucpr.edu.br", role: "Desenvolvedor", avatar: "LR", status: "ativo" },
];

export const rolePermissions = [
  { role: "Gerente", dashboard: true, kanban: true, priorizacao: true, docs: true, componentes: true, config: true },
  { role: "Líder", dashboard: true, kanban: true, priorizacao: true, docs: true, componentes: true, config: false },
  { role: "Desenvolvedor", dashboard: true, kanban: true, priorizacao: false, docs: true, componentes: true, config: false },
  { role: "QA", dashboard: true, kanban: true, priorizacao: false, docs: false, componentes: true, config: false },
];

export const integrations = [
  { name: "GitHub", desc: "Repositórios, commits, PRs e issues", status: "conectado", icon: "github" },
  { name: "GitLab", desc: "Repositórios e pipelines CI/CD", status: "desconectado", icon: "gitlab" },
  { name: "Jira", desc: "Sincronização de tarefas e sprints", status: "desconectado", icon: "jira" },
  { name: "Slack", desc: "Notificações e alertas em canais", status: "conectado", icon: "slack" },
  { name: "Jenkins", desc: "Pipelines de CI/CD e builds", status: "desconectado", icon: "jenkins" },
  { name: "SonarQube", desc: "Análise estática e qualidade de código", status: "desconectado", icon: "sonar" },
];

export const notificationSettings = [
  { key: "taskAssigned", label: "Tarefa atribuída a mim", email: true, push: true },
  { key: "taskDue", label: "Tarefa próxima do vencimento", email: true, push: true },
  { key: "taskOverdue", label: "Tarefa atrasada", email: true, push: false },
  { key: "docGenerated", label: "Documentação gerada", email: false, push: true },
  { key: "buildFailed", label: "Build com falha", email: true, push: true },
  { key: "testFailed", label: "Testes falharam", email: true, push: true },
  { key: "newComponent", label: "Novo componente na biblioteca", email: false, push: false },
  { key: "sprintEnd", label: "Sprint encerrando", email: true, push: true },
];

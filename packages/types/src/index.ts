// Enums espelhados do Prisma schema
export enum Role {
  GERENTE = "GERENTE",
  LIDER = "LIDER",
  DESENVOLVEDOR = "DESENVOLVEDOR",
  QA = "QA",
}

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  AFAZER = "AFAZER",
  PROGRESSO = "PROGRESSO",
  REVISAO = "REVISAO",
  CONCLUIDO = "CONCLUIDO",
}

export enum TaskPriority {
  CRITICA = "CRITICA",
  ALTA = "ALTA",
  MEDIA = "MEDIA",
  BAIXA = "BAIXA",
}

export enum DocType {
  OPENAPI = "OPENAPI",
  TECNICA = "TECNICA",
  MANUAL = "MANUAL",
}

export enum DocFormat {
  HTML = "HTML",
  PDF = "PDF",
  MARKDOWN = "MARKDOWN",
}

export enum DocStatus {
  ATUALIZADO = "ATUALIZADO",
  DESATUALIZADO = "DESATUALIZADO",
  RASCUNHO = "RASCUNHO",
}

export enum Quadrant {
  FAZER = "FAZER",
  AGENDAR = "AGENDAR",
  DELEGAR = "DELEGAR",
  ELIMINAR = "ELIMINAR",
}

// Payload do JWT — compartilhado entre auth middleware e clientes
export interface JwtPayload {
  userId: number;
  role: string;
}

// DTOs de usuário
export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: Role;
  customRoleId?: number | null;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

// DTOs de tarefa
export interface TaskPrioritizationDTO {
  urgency: number;
  importance: number;
  value: number;
  effort: number;
  quadrant: Quadrant;
}

export interface TaskDTO {
  id: number;
  title: string;
  desc: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  dueDate?: string | null;
  assigneeId?: number | null;
  estimatedHours?: number | null;
  createdAt: string;
  updatedAt: string;
  prioritization?: TaskPrioritizationDTO | null;
}

// DTOs de documento
export interface DocumentDTO {
  id: number;
  title: string;
  type: DocType;
  format: DocFormat;
  status: DocStatus;
  content: string;
  version: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

// RBAC
export interface RolePermissionDTO {
  id: number;
  roleName: string;
  customRoleId?: number | null;
  module: string;
  action: string;
  allowed: boolean;
}

export interface CustomRoleDTO {
  id: number;
  name: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notificações
export interface NotificationDTO {
  id: number;
  userId: number;
  type: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

// Dashboard
export interface CostBreakdownDTO {
  totalCost: number;
  totalHours: number;
  hourlyRate: number;
  byAssignee: Record<string, { hours: number; cost: number }>;
  bySprint: Record<string, { hours: number; cost: number }>;
}

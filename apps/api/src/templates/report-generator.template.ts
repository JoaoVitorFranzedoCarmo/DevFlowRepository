// Template Method — geração de relatórios
// Algoritmo fixo: coletarDados → processar → formatar → montar
// Partes variáveis definidas nas subclasses concretas

export interface ReportData {
  title: string;
  period: string;
  rows: Record<string, unknown>[];
  summary: Record<string, unknown>;
}

export abstract class ReportGenerator {
  // Template method — algoritmo fixo
  async generate(params: Record<string, unknown>): Promise<string> {
    const raw = await this.collectData(params);
    const processed = this.processData(raw);
    const formatted = this.formatRows(processed.rows);
    return this.assemble(processed.title, processed.period, formatted, processed.summary);
  }

  protected abstract collectData(params: Record<string, unknown>): Promise<ReportData>;
  protected abstract formatRows(rows: Record<string, unknown>[]): string;
  protected abstract assemble(
    title: string,
    period: string,
    body: string,
    summary: Record<string, unknown>
  ): string;

  // Hook — subclasses podem sobrescrever
  protected processData(data: ReportData): ReportData {
    return data;
  }
}

// Concreto 1 — relatório de sprint (Kanban)
export class SprintReportGenerator extends ReportGenerator {
  constructor(private taskRepo: { findAll(f: Record<string, unknown>): Promise<unknown[]> }) {
    super();
  }

  protected async collectData(params: Record<string, unknown>): Promise<ReportData> {
    const tasks = (await this.taskRepo.findAll(params)) as Record<string, unknown>[];
    return {
      title: "Relatório de Sprint",
      period: String(params.sprint ?? "atual"),
      rows: tasks,
      summary: {
        total: tasks.length,
        concluidas: tasks.filter((t) => t["status"] === "CONCLUIDO").length,
      },
    };
  }

  protected formatRows(rows: Record<string, unknown>[]): string {
    return rows
      .map((t) => `  [${t["status"]}] ${t["title"]} — prioridade: ${t["priority"]}`)
      .join("\n");
  }

  protected assemble(title: string, period: string, body: string, summary: Record<string, unknown>): string {
    return [
      `=== ${title} — ${period} ===`,
      body,
      `\nTotal: ${summary["total"]} | Concluídas: ${summary["concluidas"]}`,
    ].join("\n");
  }
}

// Concreto 2 — relatório de usuário (produtividade)
export class UserReportGenerator extends ReportGenerator {
  constructor(private userRepo: { findAll(): Promise<unknown[]> }) {
    super();
  }

  protected async collectData(_params: Record<string, unknown>): Promise<ReportData> {
    const users = (await this.userRepo.findAll()) as Record<string, unknown>[];
    return {
      title: "Relatório de Usuários",
      period: new Date().toLocaleDateString("pt-BR"),
      rows: users,
      summary: { totalUsuarios: users.length },
    };
  }

  protected formatRows(rows: Record<string, unknown>[]): string {
    return rows.map((u) => `  ${u["name"]} <${u["email"]}> — cargo: ${u["role"]}`).join("\n");
  }

  protected assemble(title: string, period: string, body: string, summary: Record<string, unknown>): string {
    return [`## ${title} (${period})`, body, `\nTotal de usuários: ${summary["totalUsuarios"]}`].join(
      "\n"
    );
  }
}

// Concreto 3 — relatório de custo estimado
export class CostReportGenerator extends ReportGenerator {
  constructor(
    private taskRepo: { findAll(f: Record<string, unknown>): Promise<unknown[]> },
    private hourlyRate: number = 50
  ) {
    super();
  }

  protected async collectData(_params: Record<string, unknown>): Promise<ReportData> {
    const tasks = (await this.taskRepo.findAll({})) as Record<string, unknown>[];
    const totalHours = tasks.reduce((s, t) => s + (Number(t["estimatedHours"]) || 0), 0);
    return {
      title: "Relatório de Custo",
      period: new Date().toLocaleDateString("pt-BR"),
      rows: tasks,
      summary: {
        totalHours,
        totalCost: totalHours * this.hourlyRate,
        hourlyRate: this.hourlyRate,
      },
    };
  }

  protected formatRows(rows: Record<string, unknown>[]): string {
    return rows
      .map((t) => {
        const cost = (Number(t["estimatedHours"]) || 0) * this.hourlyRate;
        return `  ${t["title"]}: ${t["estimatedHours"]}h — R$ ${cost.toFixed(2)}`;
      })
      .join("\n");
  }

  protected assemble(title: string, period: string, body: string, summary: Record<string, unknown>): string {
    return [
      `### ${title} — ${period}`,
      body,
      `\nTotal: ${summary["totalHours"]}h | Custo estimado: R$ ${Number(summary["totalCost"]).toFixed(2)}`,
    ].join("\n");
  }
}

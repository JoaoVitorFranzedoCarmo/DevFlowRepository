// Template Method — exportação de dados
// Algoritmo fixo: validar → extrair → transformar → serializar → empacotar
// Formato de saída varia por subclasse

export abstract class DataExporter<T extends Record<string, unknown>> {
  // Template method
  export(items: T[]): string {
    this.validate(items);
    const extracted = this.extractFields(items);
    const transformed = extracted.map((row) => this.transformRow(row));
    const body = this.serialize(transformed);
    return this.wrap(body);
  }

  protected validate(items: T[]): void {
    if (!Array.isArray(items)) throw new Error("Dados de entrada devem ser um array");
  }

  protected abstract extractFields(items: T[]): Record<string, unknown>[];
  protected abstract transformRow(row: Record<string, unknown>): Record<string, unknown>;
  protected abstract serialize(rows: Record<string, unknown>[]): string;

  // Hook — subclasses podem adicionar header/footer
  protected wrap(body: string): string {
    return body;
  }
}

// Concreto 1 — exporta tarefas como CSV
export class TaskCsvExporter extends DataExporter<Record<string, unknown>> {
  protected extractFields(items: Record<string, unknown>[]): Record<string, unknown>[] {
    return items.map(({ id, title, status, priority, estimatedHours, dueDate }) => ({
      id,
      title,
      status,
      priority,
      estimatedHours,
      dueDate,
    }));
  }

  protected transformRow(row: Record<string, unknown>): Record<string, unknown> {
    return {
      ...row,
      dueDate: row["dueDate"] ? new Date(String(row["dueDate"])).toLocaleDateString("pt-BR") : "",
      estimatedHours: String(row["estimatedHours"] ?? ""),
    };
  }

  protected serialize(rows: Record<string, unknown>[]): string {
    if (rows.length === 0) return "";
    const headers = Object.keys(rows[0]).join(";");
    const lines = rows.map((r) => Object.values(r).join(";"));
    return [headers, ...lines].join("\n");
  }

  protected wrap(body: string): string {
    return `sep=;\n${body}`;
  }
}

// Concreto 2 — exporta documentos como JSON
export class DocumentJsonExporter extends DataExporter<Record<string, unknown>> {
  protected extractFields(items: Record<string, unknown>[]): Record<string, unknown>[] {
    return items.map(({ id, title, type, format, status, version, createdAt }) => ({
      id,
      title,
      type,
      format,
      status,
      version,
      createdAt,
    }));
  }

  protected transformRow(row: Record<string, unknown>): Record<string, unknown> {
    return {
      ...row,
      createdAt: row["createdAt"] ? new Date(String(row["createdAt"])).toISOString() : null,
    };
  }

  protected serialize(rows: Record<string, unknown>[]): string {
    return JSON.stringify(rows, null, 2);
  }

  protected wrap(body: string): string {
    return `{"exportedAt":"${new Date().toISOString()}","data":${body}}`;
  }
}

// Concreto 3 — exporta componentes como XML
export class ComponentXmlExporter extends DataExporter<Record<string, unknown>> {
  protected extractFields(items: Record<string, unknown>[]): Record<string, unknown>[] {
    return items.map(({ id, name, category, lang, uses, rating }) => ({
      id,
      name,
      category,
      lang,
      uses,
      rating,
    }));
  }

  protected transformRow(row: Record<string, unknown>): Record<string, unknown> {
    return {
      ...row,
      rating: Number(row["rating"]).toFixed(1),
    };
  }

  protected serialize(rows: Record<string, unknown>[]): string {
    return rows
      .map((r) => {
        const fields = Object.entries(r)
          .map(([k, v]) => `    <${k}>${v}</${k}>`)
          .join("\n");
        return `  <component>\n${fields}\n  </component>`;
      })
      .join("\n");
  }

  protected wrap(body: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<components>\n${body}\n</components>`;
  }
}

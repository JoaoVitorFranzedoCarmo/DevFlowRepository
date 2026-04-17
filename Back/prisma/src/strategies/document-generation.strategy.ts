export interface DocumentData {
  title: string;
  type: string;
  version: string;
  status: string;
  author?: string | null;
  createdAt?: Date;
}

export interface DocumentGenerationStrategy {
  readonly format: string;
  generate(data: DocumentData): string;
}

/**
 * HtmlGenerationStrategy: gera conteúdo HTML formatado para documentos.
 */
export class HtmlGenerationStrategy implements DocumentGenerationStrategy {
  readonly format = "HTML";

  generate(data: DocumentData): string {
    const date = data.createdAt ? data.createdAt.toLocaleDateString("pt-BR") : "";
    const authorRow = data.author ? `    <tr><th>Autor</th><td>${data.author}</td></tr>\n` : "";
    const dateRow = date ? `    <tr><th>Criado em</th><td>${date}</td></tr>\n` : "";

    return (
      `<!DOCTYPE html>\n` +
      `<html lang="pt-BR">\n` +
      `<head>\n  <meta charset="UTF-8">\n  <title>${data.title}</title>\n</head>\n` +
      `<body>\n` +
      `  <h1>${data.title}</h1>\n` +
      `  <table>\n` +
      `    <tr><th>Tipo</th><td>${data.type}</td></tr>\n` +
      `    <tr><th>Versão</th><td>${data.version}</td></tr>\n` +
      `    <tr><th>Status</th><td>${data.status}</td></tr>\n` +
      authorRow +
      dateRow +
      `  </table>\n` +
      `</body>\n` +
      `</html>`
    );
  }
}

/**
 * PdfGenerationStrategy: gera markup texto estruturado para geração de PDF.
 */
export class PdfGenerationStrategy implements DocumentGenerationStrategy {
  readonly format = "PDF";

  generate(data: DocumentData): string {
    const date = data.createdAt ? data.createdAt.toLocaleDateString("pt-BR") : "";
    const separator = "=".repeat(40);
    const lines: string[] = [
      `DOCUMENTO: ${data.title}`,
      separator,
      `Tipo    : ${data.type}`,
      `Versão  : ${data.version}`,
      `Status  : ${data.status}`,
    ];
    if (data.author) lines.push(`Autor   : ${data.author}`);
    if (date) lines.push(`Criado  : ${date}`);
    return lines.join("\n");
  }
}

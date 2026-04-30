export interface DocumentData {
  title: string;
  type: string;
  version: string;
  status: string;
  author?: string | null;
  createdAt?: Date;
  sourceCode?: string;
}

export interface DocumentGenerationStrategy {
  readonly format: string;
  generate(data: DocumentData): string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function extractSignatures(source: string): string[] {
  if (!source) return [];
  const lines = source.split(/\r?\n/);
  const out: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      /^(export\s+)?(async\s+)?function\s+\w+/.test(trimmed) ||
      /^(export\s+)?class\s+\w+/.test(trimmed) ||
      /^(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s*)?\(/.test(trimmed) ||
      /^(public|private|protected)\s+\w+\s*\(/.test(trimmed) ||
      /^\s*\w+\s*\([^)]*\)\s*\{/.test(trimmed) && !/^if|^for|^while|^switch/.test(trimmed)
    ) {
      out.push(trimmed.replace(/\s*\{.*$/, ""));
    }
  }
  return out;
}

/**
 * HtmlGenerationStrategy: gera documento HTML estruturado com análise do código-fonte.
 */
export class HtmlGenerationStrategy implements DocumentGenerationStrategy {
  readonly format = "HTML";

  generate(data: DocumentData): string {
    const date = data.createdAt ? data.createdAt.toLocaleDateString("pt-BR") : "";
    const source = data.sourceCode || "";
    const signatures = extractSignatures(source);
    const lines = source ? source.split(/\r?\n/).length : 0;

    const signaturesHtml = signatures.length
      ? `  <h2>Funções e Classes Detectadas</h2>\n  <ul>\n${signatures
          .map((s) => `    <li><code>${escapeHtml(s)}</code></li>`)
          .join("\n")}\n  </ul>\n`
      : "";

    const sourceHtml = source
      ? `  <h2>Código-fonte</h2>\n  <pre><code>${escapeHtml(source)}</code></pre>\n`
      : "";

    return (
      `<!DOCTYPE html>\n` +
      `<html lang="pt-BR">\n` +
      `<head>\n  <meta charset="UTF-8">\n  <title>${escapeHtml(data.title)}</title>\n` +
      `  <style>\n` +
      `    body { font-family: 'Inter', Arial, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; color: #1B2A4A; }\n` +
      `    h1 { color: #1B2A4A; border-bottom: 3px solid #2563EB; padding-bottom: 0.5rem; }\n` +
      `    h2 { color: #2563EB; margin-top: 2rem; }\n` +
      `    table { border-collapse: collapse; margin: 1rem 0; }\n` +
      `    th, td { border: 1px solid #e2e8f0; padding: 0.5rem 1rem; text-align: left; }\n` +
      `    th { background: #f1f5f9; }\n` +
      `    pre { background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: 6px; overflow-x: auto; }\n` +
      `    code { font-family: 'Fira Code', monospace; font-size: 0.9rem; }\n` +
      `    ul li { margin: 0.25rem 0; }\n` +
      `  </style>\n` +
      `</head>\n` +
      `<body>\n` +
      `  <h1>${escapeHtml(data.title)}</h1>\n` +
      `  <h2>Metadados</h2>\n` +
      `  <table>\n` +
      `    <tr><th>Tipo</th><td>${escapeHtml(data.type)}</td></tr>\n` +
      `    <tr><th>Versão</th><td>${escapeHtml(data.version)}</td></tr>\n` +
      `    <tr><th>Status</th><td>${escapeHtml(data.status)}</td></tr>\n` +
      (data.author ? `    <tr><th>Autor</th><td>${escapeHtml(data.author)}</td></tr>\n` : "") +
      (date ? `    <tr><th>Criado em</th><td>${date}</td></tr>\n` : "") +
      (lines ? `    <tr><th>Linhas</th><td>${lines}</td></tr>\n` : "") +
      `  </table>\n` +
      signaturesHtml +
      sourceHtml +
      `</body>\n` +
      `</html>`
    );
  }
}

export class PdfGenerationStrategy implements DocumentGenerationStrategy {
  readonly format = "PDF";

  generate(data: DocumentData): string {
    const date = data.createdAt ? data.createdAt.toLocaleDateString("pt-BR") : "";
    const separator = "=".repeat(60);
    const lines: string[] = [
      `DOCUMENTO: ${data.title}`,
      separator,
      `Tipo    : ${data.type}`,
      `Versão  : ${data.version}`,
      `Status  : ${data.status}`,
    ];
    if (data.author) lines.push(`Autor   : ${data.author}`);
    if (date) lines.push(`Criado  : ${date}`);

    if (data.sourceCode) {
      const signatures = extractSignatures(data.sourceCode);
      if (signatures.length) {
        lines.push("", "FUNÇÕES/CLASSES DETECTADAS", "-".repeat(60));
        signatures.forEach((s) => lines.push(`  • ${s}`));
      }
      lines.push("", "CÓDIGO-FONTE", "-".repeat(60), data.sourceCode);
    }

    return lines.join("\n");
  }
}

export class MarkdownGenerationStrategy implements DocumentGenerationStrategy {
  readonly format = "MARKDOWN";

  generate(data: DocumentData): string {
    const date = data.createdAt ? data.createdAt.toLocaleDateString("pt-BR") : "";
    const parts: string[] = [];
    parts.push(`# ${data.title}`, "");
    parts.push(`## Metadados`, "");
    parts.push(`| Campo | Valor |`);
    parts.push(`| --- | --- |`);
    parts.push(`| Tipo | ${data.type} |`);
    parts.push(`| Versão | ${data.version} |`);
    parts.push(`| Status | ${data.status} |`);
    if (data.author) parts.push(`| Autor | ${data.author} |`);
    if (date) parts.push(`| Criado em | ${date} |`);
    parts.push("");

    if (data.sourceCode) {
      const signatures = extractSignatures(data.sourceCode);
      if (signatures.length) {
        parts.push(`## Funções e Classes Detectadas`, "");
        signatures.forEach((s) => parts.push(`- \`${s}\``));
        parts.push("");
      }
      parts.push(`## Código-fonte`, "", "```", data.sourceCode, "```");
    }
    return parts.join("\n");
  }
}

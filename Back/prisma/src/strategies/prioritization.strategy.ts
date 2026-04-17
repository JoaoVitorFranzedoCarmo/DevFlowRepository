export interface TaskPrioritizationData {
  urgency: number;
  importance: number;
  value: number;
  effort: number;
}

export interface PrioritizationStrategy {
  readonly name: string;
  score(p: TaskPrioritizationData): number;
}

/**
 * WSJF (Weighted Shortest Job First):
 * score = (value × importance × urgency) / effort
 * Fórmula original do projeto — prioriza itens de alto valor com menor esforço.
 */
export class WSJFStrategy implements PrioritizationStrategy {
  readonly name = "WSJF";

  score(p: TaskPrioritizationData): number {
    return Math.round(((p.value * p.importance * p.urgency) / Math.max(p.effort, 1)) * 10) / 10;
  }
}

/**
 * Eisenhower Matrix:
 * score = urgency × importance
 * Prioriza tarefas urgentes E importantes, ignorando valor e esforço.
 */
export class EisenhowerStrategy implements PrioritizationStrategy {
  readonly name = "Eisenhower";

  score(p: TaskPrioritizationData): number {
    return Math.round(p.urgency * p.importance * 10) / 10;
  }
}

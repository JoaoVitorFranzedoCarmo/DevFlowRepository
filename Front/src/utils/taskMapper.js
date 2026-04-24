// src/utils/taskMapper.js
export const PRIORITY_DOWN = { CRITICA: "critica", ALTA: "alta", MEDIA: "media", BAIXA: "baixa" };

export const QUADRANT_KEY = { FAZER: "fazer", AGENDAR: "agendar", DELEGAR: "delegar", ELIMINAR: "eliminar" };

export function toDateInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function quadrantFromPriority(priority) {
  switch (priority) {
    case "CRITICA": return "fazer";
    case "ALTA":    return "agendar";
    case "MEDIA":   return "delegar";
    default:        return "eliminar";
  }
}

export function mapTask(t) {
  const deps = (t.dependsOn || []).map((d) => d.targetTask).filter(Boolean);
  const p = t.prioritization || null;
  const explicitQuadrant = p?.quadrant ? QUADRANT_KEY[p.quadrant] : null;
  return {
    id: t.id,
    title: t.title,
    desc: t.desc || "",
    statusRaw: t.status,
    priorityRaw: t.priority,
    priority: PRIORITY_DOWN[t.priority] || "media",
    assignee: t.assignee?.name || "—",
    assigneeId: t.assigneeId || "",
    estimatedHours: t.estimatedHours ?? 2,
    tags: t.tags || [],
    dueDateRaw: toDateInput(t.dueDate),
    dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString("pt-BR") : "—",
    dependencies: deps,
    dependencyIds: deps.map((d) => d.id),
    prioritization: p,
    quadrant: p?.quadrant || null,
    quadrantKey: explicitQuadrant ?? quadrantFromPriority(t.priority),
    urgency: p?.urgency ?? null,
    importance: p?.importance ?? null,
    value: p?.value ?? null,
    effort: p?.effort ?? null,
    score: p ? (p.value * p.importance * p.urgency) / Math.max(p.effort, 1) : 0,
  };
}

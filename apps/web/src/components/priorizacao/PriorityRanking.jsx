// src/components/priorizacao/PriorityRanking.jsx
import { useState } from "react";
import { priorityConfig, statusConfig } from "../../data/priorizacaoData";

const STATUS_KEY = {
  BACKLOG: "backlog", AFAZER: "afazer", PROGRESSO: "progresso", REVISAO: "revisao", CONCLUIDO: "concluido",
};

export default function PriorityRanking({ tasks = [], onEdit }) {
  const [sortBy, setSortBy] = useState("score");

  const ranked = [...tasks]
    .map((t) => ({ ...t, score: Math.round((t.score || 0) * 10) / 10 }))
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "value") return (b.value || 0) - (a.value || 0);
      if (sortBy === "effort") return (a.effort || 0) - (b.effort || 0);
      if (sortBy === "urgency") return (b.urgency || 0) - (a.urgency || 0);
      return 0;
    });

  const maxScore = ranked.length ? Math.max(...ranked.map((t) => t.score), 1) : 1;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">Ranking de Prioridade</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Score = (Valor × Importância × Urgência) ÷ Esforço · WSJF
          </p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-[12px] bg-white text-slate-600 cursor-pointer"
        >
          <option value="score">Ordenar por Score</option>
          <option value="value">Ordenar por Valor</option>
          <option value="effort">Ordenar por Esforço (menor)</option>
          <option value="urgency">Ordenar por Urgência</option>
        </select>
      </div>

      <div className="grid grid-cols-[32px_1fr_80px_60px_60px_60px_60px_80px_100px] gap-2 px-3 py-2 text-[11px] text-slate-400 font-medium border-b border-slate-100 dark:border-slate-700">
        <span>#</span>
        <span>Tarefa</span>
        <span className="text-center">Status</span>
        <span className="text-center">Valor</span>
        <span className="text-center">Esforço</span>
        <span className="text-center">Urg.</span>
        <span className="text-center">Imp.</span>
        <span className="text-center">Prioridade</span>
        <span className="text-right">Score</span>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {ranked.length === 0 && (
          <div className="text-center text-slate-400 text-sm py-6">Nenhuma tarefa priorizada.</div>
        )}
        {ranked.map((task, i) => {
          const p = priorityConfig[task.priority] || priorityConfig.media;
          const s = statusConfig[STATUS_KEY[task.statusRaw]] || { label: task.statusRaw, color: "bg-slate-100 text-slate-600" };
          const barWidth = (task.score / maxScore) * 100;
          const initials = task.assignee !== "—"
            ? task.assignee.split(" ").map((n) => n[0]).join("").slice(0, 2)
            : "?";

          return (
            <button
              key={task.id}
              onClick={() => onEdit && onEdit(task)}
              className="w-full text-left grid grid-cols-[32px_1fr_80px_60px_60px_60px_60px_80px_100px] gap-2 px-3 py-2.5 items-center text-[12px] border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
            >
              <span className="text-[11px] font-bold text-slate-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[8px] font-semibold shrink-0">
                  {initials}
                </div>
                <span className="font-medium text-[#1B2A4A] dark:text-slate-100 truncate">{task.title}</span>
              </div>
              <div className="text-center">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${s.color}`}>
                  {s.label}
                </span>
              </div>
              <div className="text-center font-medium text-blue-600">{task.value ?? "—"}</div>
              <div className="text-center font-medium text-amber-600">{task.effort ?? "—"}</div>
              <div className="text-center text-slate-500 dark:text-slate-400">{task.urgency ?? "—"}</div>
              <div className="text-center text-slate-500 dark:text-slate-400">{task.importance ?? "—"}</div>
              <div className="text-center">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${p.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                  {p.label}
                </span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${barWidth}%` }} />
                </div>
                <span className="font-bold text-[#1B2A4A] dark:text-slate-100 text-[12px] w-8 text-right">
                  {task.score}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

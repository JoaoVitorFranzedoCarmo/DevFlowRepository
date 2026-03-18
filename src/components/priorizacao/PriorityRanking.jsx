// src/components/priorizacao/PriorityRanking.jsx

import { useState } from "react";
import { priorityTasks, priorityConfig, statusConfig } from "../../data/priorizacaoData";

export default function PriorityRanking() {
  const [sortBy, setSortBy] = useState("score");

  // Calculate priority score: (value * importance * urgency) / effort
  const ranked = priorityTasks
    .map((t) => ({
      ...t,
      score: Math.round(((t.value * t.importance * t.urgency) / Math.max(t.effort, 1)) * 10) / 10,
    }))
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "value") return b.value - a.value;
      if (sortBy === "effort") return a.effort - b.effort;
      if (sortBy === "urgency") return b.urgency - a.urgency;
      return 0;
    });

  const maxScore = Math.max(...ranked.map((t) => t.score));

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#1B2A4A]">Ranking de Prioridade</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Score = (Valor × Importância × Urgência) ÷ Esforço
          </p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-md text-[12px] bg-white text-slate-600 cursor-pointer"
        >
          <option value="score">Ordenar por Score</option>
          <option value="value">Ordenar por Valor</option>
          <option value="effort">Ordenar por Esforço (menor)</option>
          <option value="urgency">Ordenar por Urgência</option>
        </select>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[32px_1fr_80px_60px_60px_60px_60px_80px_100px] gap-2 px-3 py-2 text-[11px] text-slate-400 font-medium border-b border-slate-100">
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

      {/* Rows */}
      <div className="max-h-[400px] overflow-y-auto">
        {ranked.map((task, i) => {
          const p = priorityConfig[task.priority];
          const s = statusConfig[task.status];
          const barWidth = (task.score / maxScore) * 100;
          const initials = task.assignee.split(" ").map((n) => n[0]).join("");

          return (
            <div
              key={task.id}
              className="grid grid-cols-[32px_1fr_80px_60px_60px_60px_60px_80px_100px] gap-2 px-3 py-2.5 items-center text-[12px] border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer"
            >
              {/* Rank */}
              <span className="text-[11px] font-bold text-slate-300">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Task name + assignee */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[8px] font-semibold shrink-0">
                  {initials}
                </div>
                <span className="font-medium text-[#1B2A4A] truncate">{task.title}</span>
              </div>

              {/* Status */}
              <div className="text-center">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${s.color}`}>
                  {s.label}
                </span>
              </div>

              {/* Value */}
              <div className="text-center font-medium text-blue-600">{task.value}</div>

              {/* Effort */}
              <div className="text-center font-medium text-amber-600">{task.effort}</div>

              {/* Urgency */}
              <div className="text-center text-slate-500">{task.urgency}</div>

              {/* Importance */}
              <div className="text-center text-slate-500">{task.importance}</div>

              {/* Priority badge */}
              <div className="text-center">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${p.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                  {p.label}
                </span>
              </div>

              {/* Score with bar */}
              <div className="flex items-center gap-2 justify-end">
                <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="font-bold text-[#1B2A4A] text-[12px] w-8 text-right">
                  {task.score}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

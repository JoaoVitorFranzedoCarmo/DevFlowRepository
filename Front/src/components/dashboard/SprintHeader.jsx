// src/components/dashboard/SprintHeader.jsx

import { sprintInfo } from "../../data/dashboardData";

export default function SprintHeader() {
  const progressPercent = Math.round(
    ((sprintInfo.totalDays - sprintInfo.daysLeft) / sprintInfo.totalDays) * 100
  );

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-[#1B2A4A]">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {sprintInfo.name} · {sprintInfo.startDate} — {sprintInfo.endDate}
        </p>
      </div>

      <div
        className="flex items-center gap-4"
        role="region"
        aria-label={`Progresso da sprint: ${progressPercent}%, ${sprintInfo.daysLeft} dias restantes`}
      >
        <div className="text-right">
          <div className="text-xs text-slate-400">Progresso da Sprint</div>
          <div className="text-sm font-semibold text-[#1B2A4A]">
            {sprintInfo.daysLeft} dias restantes
          </div>
        </div>

        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${progressPercent}% concluído`}
          className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="text-sm font-semibold text-blue-600" aria-hidden="true">{progressPercent}%</span>
      </div>
    </div>
  );
}

// src/components/componentes/StatsBar.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function StatsBar() {
  const [stats, setStats] = useState({ total: 0, totalUses: 0, categories: 0, lessons: 0 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [{ data: compStats }, { data: lessons }] = await Promise.all([
          api.get("/components/stats").catch(() => ({ data: null })),
          api.get("/lessons").catch(() => ({ data: [] })),
        ]);
        if (!mounted) return;
        setStats({
          total: compStats?.total ?? 0,
          totalUses: compStats?.totalUses ?? 0,
          categories: compStats?.categories ?? 0,
          lessons: Array.isArray(lessons) ? lessons.length : 0,
        });
      } catch {
        /* silencioso */
      }
    })();
    return () => { mounted = false; };
  }, []);

  const items = [
    { label: "Total de Componentes", value: stats.total, color: "text-[#1B2A4A] dark:text-slate-100" },
    { label: "Reutilizações", value: stats.totalUses, color: "text-blue-600" },
    { label: "Categorias", value: stats.categories, color: "text-green-600" },
    { label: "Lições Aprendidas", value: stats.lessons, color: "text-amber-500" },
  ];

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {items.map((s, i) => (
        <div key={i} className="flex-1 min-w-[180px] bg-white dark:bg-slate-800 rounded-lg px-5 py-4 border border-slate-200 dark:border-slate-700">
          <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

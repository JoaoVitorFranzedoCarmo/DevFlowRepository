// src/components/dashboard/TopComponents.jsx
export default function TopComponents({ components = [] }) {
  const top = [...components]
    .sort((a, b) => (b.uses ?? 0) - (a.uses ?? 0))
    .slice(0, 6);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100 mb-4">
        Componentes Mais Reutilizados
      </h3>

      <div className="flex flex-col">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-3 py-2 text-xs text-slate-400 font-medium border-b border-slate-100 dark:border-slate-700">
          <span className="w-6">#</span>
          <span>Componente</span>
          <span className="w-20 text-center">Linguagem</span>
          <span className="w-12 text-right">Usos</span>
        </div>

        {top.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-6">Nenhum componente cadastrado.</p>
        )}

        {top.map((comp, i) => (
          <div
            key={comp.id}
            className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-3 py-3 items-center text-sm border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
          >
            <span className="w-6 text-xs font-bold text-slate-300">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-medium text-[#1B2A4A] dark:text-slate-100 truncate">{comp.name}</span>
            <span className="w-20 text-center">
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded text-[11px]">
                {comp.lang}
              </span>
            </span>
            <span className="w-12 text-right font-semibold text-blue-600">
              {comp.uses ?? 0}x
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

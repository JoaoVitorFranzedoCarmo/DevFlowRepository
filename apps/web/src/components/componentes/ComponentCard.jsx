// src/components/componentes/ComponentCard.jsx
import StarRating from "./StarRating";

export default function ComponentCard({ comp, onClick }) {
  const authorName = comp.author?.name || comp.author || "—";
  const initials = typeof authorName === "string"
    ? authorName.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : "?";

  return (
    <div
      onClick={() => onClick(comp)}
      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 cursor-pointer transition-all hover:border-blue-600 hover:shadow-[0_2px_8px_rgba(37,99,235,0.1)]"
    >
      <div className="flex justify-between mb-2">
        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded text-[11px] font-semibold">
          {comp.category}
        </span>
        <span className="bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 px-2 py-0.5 rounded text-[11px]">
          {comp.lang}
        </span>
      </div>

      <div className="text-[15px] font-semibold text-[#1B2A4A] dark:text-slate-100 mb-1.5">{comp.name}</div>

      <div className="text-[13px] text-slate-400 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
        {comp.desc}
      </div>

      <div className="flex gap-1.5 flex-wrap mb-3">
        {(comp.tags || []).map((t) => (
          <span
            key={t}
            className="bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-300 px-2 py-0.5 rounded text-[11px]"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-1.5">
          <div className="w-[22px] h-[22px] rounded-full bg-[#1B2A4A] dark:bg-blue-600 text-white flex items-center justify-center text-[9px] font-semibold">
            {initials}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-400">{authorName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 dark:text-slate-400">{comp.uses ?? 0}x usado</span>
          <StarRating rating={comp.rating ?? 0} />
        </div>
      </div>
    </div>
  );
}

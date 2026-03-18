// src/components/componentes/ComponentCard.jsx

import StarRating from "./StarRating";

export default function ComponentCard({ comp, onClick }) {
  const initials = comp.author
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      onClick={() => onClick(comp)}
      className="bg-white rounded-lg border border-slate-200 p-5 cursor-pointer transition-all hover:border-blue-600 hover:shadow-[0_2px_8px_rgba(37,99,235,0.1)]"
    >
      {/* Category & Language badges */}
      <div className="flex justify-between mb-2">
        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] font-semibold">
          {comp.category}
        </span>
        <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded text-[11px]">
          {comp.lang}
        </span>
      </div>

      {/* Name */}
      <div className="text-[15px] font-semibold text-[#1B2A4A] mb-1.5">{comp.name}</div>

      {/* Description */}
      <div className="text-[13px] text-slate-400 leading-relaxed mb-3 line-clamp-2">
        {comp.desc}
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {comp.tags.map((t) => (
          <span
            key={t}
            className="bg-slate-50 text-slate-400 px-2 py-0.5 rounded text-[11px]"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-[22px] h-[22px] rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[9px] font-semibold">
            {initials}
          </div>
          <span className="text-xs text-slate-400">{comp.author}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{comp.uses}x usado</span>
          <StarRating rating={comp.rating} />
        </div>
      </div>
    </div>
  );
}

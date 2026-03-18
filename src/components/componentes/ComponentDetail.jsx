// src/components/componentes/ComponentDetail.jsx

import StarRating from "./StarRating";

export default function ComponentDetail({ comp, onBack }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-[#1B2A4A] px-6 py-5 flex justify-between items-center">
        <div>
          <div className="text-white text-lg font-bold">{comp.name}</div>
          <div className="text-white/60 text-[13px] mt-1">
            {comp.category} · {comp.lang}
          </div>
        </div>
        <button
          onClick={onBack}
          className="bg-white/15 text-white px-3.5 py-1.5 rounded-md text-[13px] hover:bg-white/25 transition-colors"
        >
          Voltar
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-[2fr_1fr] gap-6">
          {/* Left Column */}
          <div>
            <h3 className="text-[15px] font-semibold text-[#1B2A4A] mb-2">Descrição</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">{comp.desc}</p>

            <h3 className="text-[15px] font-semibold text-[#1B2A4A] mb-2">Tags</h3>
            <div className="flex gap-1.5 flex-wrap mb-5">
              {comp.tags.map((t) => (
                <span
                  key={t}
                  className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>

            <h3 className="text-[15px] font-semibold text-[#1B2A4A] mb-2">
              Prévia do Código
            </h3>
            <div className="bg-slate-800 rounded-lg p-4 font-mono text-xs text-slate-400 leading-7">
              <div>
                <span className="text-purple-400">import</span>{" "}
                <span className="text-blue-400">
                  {"{ " + comp.tags[0] + " }"}
                </span>{" "}
                <span className="text-purple-400">from</span>{" "}
                <span className="text-green-500">
                  '{comp.name.toLowerCase().replace(/ /g, "-")}'
                </span>
                ;
              </div>
              <div className="mt-2">
                <span className="text-slate-500">// Exemplo de uso</span>
              </div>
              <div>
                <span className="text-purple-400">const</span>{" "}
                <span className="text-amber-400">result</span> ={" "}
                <span className="text-purple-400">await</span>{" "}
                <span className="text-blue-400">{comp.tags[0]}</span>.
                <span className="text-amber-400">init</span>();
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
              <div className="text-[13px] text-slate-400 mb-3">Informações</div>
              {[
                ["Autor", comp.author],
                ["Criado em", comp.date],
                ["Linguagem", comp.lang],
                ["Reutilizações", comp.uses + "x"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between py-2 border-b border-slate-100"
                >
                  <span className="text-[13px] text-slate-400">{label}</span>
                  <span className="text-[13px] text-[#1B2A4A] font-medium">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-2">
                <span className="text-[13px] text-slate-400">Avaliação</span>
                <StarRating rating={comp.rating} />
              </div>
            </div>

            <button className="w-full mt-4 py-3 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors">
              Importar para Projeto
            </button>
            <button className="w-full mt-2 py-3 bg-transparent text-blue-600 border border-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">
              Ver Código Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

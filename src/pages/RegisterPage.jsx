// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const roles = [
  { value: "DESENVOLVEDOR", label: "Desenvolvedor" },
  { value: "QA", label: "QA / Analista" },
  { value: "LIDER", label: "Líder Técnico" },
  { value: "GERENTE", label: "Gerente de Projeto" },
];

export default function RegisterPage({ onGoLogin }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("DESENVOLVEDOR");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Senha deve ter no mínimo 6 caracteres."); return; }
    setLoading(true);
    try {
      await register(name, email, password, role);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-[#1B2A4A] text-3xl font-bold tracking-widest mb-1">DEVFLOW</div>
          <div className="text-slate-400 text-sm">Gestão de Equipes de Desenvolvimento</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#1B2A4A] mb-1">Criar conta</h2>
          <p className="text-sm text-slate-400 mb-6">Preencha os dados para se registrar</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                minLength={2}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full py-2.5 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full py-2.5 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Papel / Cargo</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-md text-sm bg-white text-slate-600 outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-400">
            Já tem conta?{" "}
            <button
              onClick={onGoLogin}
              className="text-blue-600 font-medium hover:underline"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

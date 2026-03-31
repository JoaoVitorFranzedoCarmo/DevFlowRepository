// src/components/LoginPage.jsx

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1B2A4A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-white text-3xl font-bold tracking-widest mb-1">DEVFLOW</div>
          <div className="text-white/40 text-sm">Gestão de Equipes de Desenvolvimento</div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-[#1B2A4A] mb-1">
            {isRegister ? "Criar Conta" : "Entrar"}
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            {isRegister
              ? "Preencha os dados para criar sua conta"
              : "Faça login para acessar o sistema"}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <div>
                <label className="text-xs font-medium text-[#1B2A4A] mb-1.5 block">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="w-full py-2.5 px-3.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-[#1B2A4A] mb-1.5 block">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                className="w-full py-2.5 px-3.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#1B2A4A] mb-1.5 block">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                minLength={6}
                className="w-full py-2.5 px-3.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? "Carregando..."
                : isRegister
                ? "Criar Conta"
                : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {isRegister
                ? "Já tem conta? Faça login"
                : "Não tem conta? Cadastre-se"}
            </button>
          </div>

          {/* Quick login hint */}
          {!isRegister && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-400 font-medium mb-1">Acesso rápido (seed):</div>
              <button
                type="button"
                onClick={() => {
                  setEmail("joao.vitor@pucpr.edu.br");
                  setPassword("123456");
                }}
                className="text-[12px] text-blue-600 hover:underline block"
              >
                João Vitor (Gerente)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("leander.hallu@pucpr.edu.br");
                  setPassword("123456");
                }}
                className="text-[12px] text-blue-600 hover:underline block mt-0.5"
              >
                Leander (Desenvolvedor)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

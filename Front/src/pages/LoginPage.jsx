// src/pages/LoginPage.jsx
import { useState, useId } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onGoRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const errorId = useId();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || "Credenciais inválidas. Verifique e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-[#1B2A4A] text-3xl font-bold tracking-widest mb-1" aria-label="DevFlow">DEVFLOW</div>
          <div className="text-slate-400 text-sm">Gestão de Equipes de Desenvolvimento</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h1 className="text-lg font-bold text-[#1B2A4A] mb-1">Entrar na plataforma</h1>
          <p className="text-sm text-slate-400 mb-6" id="login-desc">Insira suas credenciais para acessar</p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            aria-describedby={error ? errorId : "login-desc"}
            noValidate
          >
            <div>
              <label htmlFor="login-email" className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">
                E-mail
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="w-full py-2.5 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">
                Senha
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full py-2.5 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {error && (
              <div
                id={errorId}
                role="alert"
                aria-live="assertive"
                className="bg-red-50 border border-red-200 rounded-md px-3 py-2.5 text-sm text-red-600 flex items-start gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Entrando...
                </>
              ) : "Entrar"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-400">
            Não tem conta?{" "}
            <button
              onClick={onGoRegister}
              className="text-blue-600 font-medium hover:underline"
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

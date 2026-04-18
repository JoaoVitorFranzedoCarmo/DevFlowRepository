// src/components/NotificationBell.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import api from "../services/api";

const POLL_MS = 30000;

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s atrás`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  return `${d}d atrás`;
}

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  const fetchFeed = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications/feed");
      setItems(data.items || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    const id = setInterval(fetchFeed, POLL_MS);
    return () => clearInterval(id);
  }, [fetchFeed]);

  useEffect(() => {
    if (!open) return;
    function onClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function handleMarkRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      setItems((arr) => arr.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Erro ao marcar lida:", err);
    }
  }

  async function handleMarkAll() {
    setLoading(true);
    try {
      await api.patch("/notifications/read-all");
      setItems((arr) => arr.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Erro ao marcar todas:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notificações"
        className="relative w-9 h-9 rounded-md flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-[360px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 flex flex-col max-h-[480px]">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">Notificações</h4>
              <p className="text-[10px] text-slate-400">
                {unreadCount > 0 ? `${unreadCount} não lida(s)` : "Tudo em dia"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                disabled={loading}
                className="text-[11px] font-medium text-blue-600 hover:underline disabled:opacity-50"
              >
                Marcar todas
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                Nenhuma notificação ainda.
              </div>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  className={`px-4 py-3 border-b border-slate-50 dark:border-slate-700 last:border-0 cursor-pointer transition-colors ${
                    n.read
                      ? "hover:bg-slate-50 dark:hover:bg-slate-700/40"
                      : "bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-[#1B2A4A] dark:text-slate-100 leading-snug">{n.message}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                        <span className="font-mono">{n.type}</span>
                        <span>·</span>
                        <span>{timeAgo(n.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

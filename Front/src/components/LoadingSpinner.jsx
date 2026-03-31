// src/components/LoadingSpinner.jsx

export default function LoadingSpinner({ message = "Carregando..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
      <svg
        className="animate-spin mb-3"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      </svg>
      <span className="text-sm">{message}</span>
    </div>
  );
}

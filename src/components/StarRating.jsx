// src/components/StarRating.jsx

export default function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <span className="text-amber-400 text-sm">
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(5 - full - (half ? 1 : 0))}
      <span className="text-slate-400 ml-1 text-xs">{rating}</span>
    </span>
  );
}

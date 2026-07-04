import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, total, limit, onChange }) {
  if (!total) return null;

  const from = (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-soft)] px-5 py-3">
      <p className="text-xs text-[var(--text-muted)] font-mono">
        Showing <span className="text-[var(--text)]">{from}–{to}</span> of{" "}
        <span className="text-[var(--text)]">{total}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage <= 1}
          onClick={() => onChange(currentPage - 1)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-muted)]"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="min-w-[70px] text-center text-xs font-mono text-[var(--text-muted)]">
          Page {currentPage} / {Math.max(totalPages, 1)}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onChange(currentPage + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-muted)]"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

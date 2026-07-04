import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";

export default function EmptyState({
  title = "No orders here",
  message = "Nothing matches this filter yet. Try another status or clear your search.",
  actionLabel,
  onAction
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[var(--text-muted)]">
        <PackageSearch size={22} strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-sm font-semibold text-[var(--text)]">
        {title}
      </h3>
      <p className="max-w-xs text-sm text-[var(--text-muted)]">{message}</p>
      {actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="mt-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          {actionLabel}
        </button>
      ) : null}
    </motion.div>
  );
}

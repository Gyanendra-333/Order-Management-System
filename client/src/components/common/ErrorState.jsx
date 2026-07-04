import { motion } from "framer-motion";
import { TriangleAlert, RotateCw } from "lucide-react";

export default function ErrorState({
  message = "Couldn't reach the server.",
  onRetry
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          color: "var(--status-cancelled)",
          background: "color-mix(in srgb, var(--status-cancelled) 14%, transparent)"
        }}
      >
        <TriangleAlert size={22} strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-sm font-semibold text-[var(--text)]">
        Something broke on our end
      </h3>
      <p className="max-w-sm text-sm text-[var(--text-muted)]">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <RotateCw size={14} />
          Try again
        </button>
      ) : null}
    </motion.div>
  );
}

import { motion } from "framer-motion";

export default function LoadingState({ rows = 6 }) {
  return (
    <div className="divide-y divide-[var(--border-soft)]">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          {[28, 18, 14, 20, 12, 16, 12, 14].map((w, j) => (
            <motion.div
              key={j}
              className="h-3 rounded bg-[var(--surface-hover)]"
              style={{ width: `${w}%` }}
              animate={{ opacity: [0.4, 0.85, 0.4] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.05 + j * 0.03
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

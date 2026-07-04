import { motion } from "framer-motion";
import { Moon, Sun, Radar } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
            <Radar size={17} strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display text-[15px] font-bold leading-none tracking-tight text-[var(--text)]">
              Order Control
            </h1>
            <p className="mt-1 text-[11px] leading-none text-[var(--text-muted)]">
              Fulfillment tracking &amp; scheduler console
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="relative flex h-9 w-16 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-1 transition hover:border-[var(--accent)]"
        >
          <motion.div
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[#0a0e12]"
            animate={{ x: isDark ? 0 : 28 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {isDark ? <Moon size={14} /> : <Sun size={14} />}
          </motion.div>
        </button>
      </div>
    </header>
  );
}

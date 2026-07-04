import { useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Plus } from "lucide-react";
import { useOrders } from "../../context/OrderContext.jsx";
import { ORDER_STATUS_META } from "../../utils/constants.js";
import SchedulerPulse from "../common/SchedulerPulse.jsx";

export default function FilterBar({ onCreateClick }) {
  const { status, updateStatus, updateSearch, refresh, refreshing } = useOrders();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-col gap-3 border-b border-[var(--border-soft)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
        >
          <option value="">All statuses</option>
          {Object.entries(ORDER_STATUS_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              updateSearch(e.target.value);
            }}
            placeholder="Search order ID or customer…"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2 pl-9 pr-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--accent)]"
          />
        </div>

        <button
          onClick={refresh}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <motion.span
            animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
            className="flex"
          >
            <RefreshCw size={14} />
          </motion.span>
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden md:block">
          <SchedulerPulse />
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-[#0a0e12] transition hover:brightness-110"
        >
          <Plus size={15} />
          New order
        </button>
      </div>
    </div>
  );
}

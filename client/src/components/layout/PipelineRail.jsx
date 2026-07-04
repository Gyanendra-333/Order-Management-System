import { motion } from "framer-motion";
import { ORDER_STATUS_FLOW, ORDER_STATUS_META, ORDER_STATUS } from "../../utils/constants.js";
import { useOrders } from "../../context/OrderContext.jsx";

export default function PipelineRail() {
  const { statusCounts, status, updateStatus } = useOrders();
  const cancelledCount = statusCounts[ORDER_STATUS.CANCELLED] || 0;

  return (
    <div className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="mx-auto max-w-6xl px-5 py-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {ORDER_STATUS_FLOW.map((s, idx) => {
            const meta = ORDER_STATUS_META[s];
            const count = statusCounts[s] ?? "—";
            const isActive = status === s;
            const isLast = idx === ORDER_STATUS_FLOW.length - 1;

            return (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => updateStatus(isActive ? "" : s)}
                  className="group flex flex-col items-center gap-1.5 rounded-lg px-3 py-1.5 transition"
                  style={{
                    background: isActive
                      ? `color-mix(in srgb, var(${meta.var}) 14%, transparent)`
                      : "transparent"
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="relative flex h-2.5 w-2.5 items-center justify-center rounded-full"
                      style={{ background: `var(${meta.var})` }}
                    >
                      {count > 0 && (
                        <motion.span
                          className="absolute inline-flex h-full w-full rounded-full"
                          style={{ background: `var(${meta.var})` }}
                          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: idx * 0.3
                          }}
                        />
                      )}
                    </span>
                    <span
                      className={`font-mono text-sm font-semibold tabular-nums ${
                        isActive ? "" : "text-[var(--text)]"
                      }`}
                      style={isActive ? { color: `var(${meta.var})` } : undefined}
                    >
                      {count}
                    </span>
                  </div>
                  <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] group-hover:text-[var(--text)]">
                    {meta.label}
                  </span>
                </button>

                {!isLast && (
                  <div className="mx-1 h-px w-6 shrink-0 bg-[var(--border)] sm:w-10" />
                )}
              </div>
            );
          })}

          <div className="mx-2 h-8 w-px shrink-0 bg-[var(--border)]" />

          <button
            onClick={() =>
              updateStatus(status === ORDER_STATUS.CANCELLED ? "" : ORDER_STATUS.CANCELLED)
            }
            className="flex flex-col items-center gap-1.5 rounded-lg px-3 py-1.5 transition"
            style={{
              background:
                status === ORDER_STATUS.CANCELLED
                  ? "color-mix(in srgb, var(--status-cancelled) 14%, transparent)"
                  : "transparent"
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: "var(--status-cancelled)" }}
              />
              <span
                className="font-mono text-sm font-semibold tabular-nums"
                style={{
                  color:
                    status === ORDER_STATUS.CANCELLED
                      ? "var(--status-cancelled)"
                      : "var(--text)"
                }}
              >
                {cancelledCount}
              </span>
            </div>
            <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Cancelled
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

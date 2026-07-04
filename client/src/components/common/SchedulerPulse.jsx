import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, XCircle } from "lucide-react";
import { useOrders } from "../../context/OrderContext.jsx";
import { timeAgo } from "../../utils/formatters.js";
import { SCHEDULER_INTERVAL_MINUTES } from "../../utils/constants.js";

function useNextTickCountdown(lastRunAt) {
  const [label, setLabel] = useState("—");

  useEffect(() => {
    if (!lastRunAt) return undefined;

    const intervalMs = SCHEDULER_INTERVAL_MINUTES * 60 * 1000;
    const last = new Date(lastRunAt).getTime();

    const tick = () => {
      const elapsed = Date.now() - last;
      const remainder = intervalMs - (elapsed % intervalMs);
      const seconds = Math.max(0, Math.floor(remainder / 1000));
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      setLabel(`${m}:${String(s).padStart(2, "0")}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastRunAt]);

  return label;
}

export default function SchedulerPulse() {
  const { schedulerStatus } = useOrders();
  const lastRunAt = schedulerStatus?.endedAt || schedulerStatus?.createdAt;
  const countdown = useNextTickCountdown(lastRunAt);
  const isHealthy = schedulerStatus ? schedulerStatus.success : null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5">
      <div className="relative flex h-7 w-7 items-center justify-center">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full"
          style={{
            background: isHealthy === false ? "var(--status-cancelled)" : "var(--status-delivered)"
          }}
          animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
        <span
          className="relative flex h-2.5 w-2.5 rounded-full"
          style={{
            background: isHealthy === false ? "var(--status-cancelled)" : "var(--status-delivered)"
          }}
        />
      </div>

      <div className="leading-tight">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
          <Activity size={12} className="text-[var(--text-muted)]" />
          Scheduler
          {schedulerStatus ? (
            isHealthy ? (
              <CheckCircle2 size={12} style={{ color: "var(--status-delivered)" }} />
            ) : (
              <XCircle size={12} style={{ color: "var(--status-cancelled)" }} />
            )
          ) : null}
        </div>
        <p className="font-mono text-[11px] text-[var(--text-muted)]">
          {schedulerStatus ? (
            <>
              last run {timeAgo(lastRunAt)} · updated {schedulerStatus.ordersUpdated ?? 0} · next
              in {countdown}
            </>
          ) : (
            "waiting for first run…"
          )}
        </p>
      </div>
    </div>
  );
}

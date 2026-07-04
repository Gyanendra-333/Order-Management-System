import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, LoaderCircle, ArrowRight, Ban } from "lucide-react";
import StatusBadge from "../common/StatusBadge.jsx";
import PaymentBadge from "../common/PaymentBadge.jsx";
import { fetchOrderTimeline } from "../../api/orderApi.js";
import { useOrders } from "../../context/OrderContext.jsx";
import { formatCurrency, formatDateTime, formatPhone } from "../../utils/formatters.js";
import { ORDER_STATUS_META } from "../../utils/constants.js";
import workflowNextStatus from "../../utils/workflow.js";

export default function OrderDetailDrawer({ order, onClose }) {
  const { updateStatusFor } = useOrders();
  const [timeline, setTimeline] = useState([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [timelineError, setTimelineError] = useState(null);
  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState(null);

  useEffect(() => {
    if (!order) return;
    let cancelled = false;

    setLoadingTimeline(true);
    setTimelineError(null);
    fetchOrderTimeline(order._id)
      .then((logs) => {
        if (!cancelled) setTimeline(logs);
      })
      .catch((err) => {
        if (!cancelled) setTimelineError(err.message || "Couldn't load history.");
      })
      .finally(() => {
        if (!cancelled) setLoadingTimeline(false);
      });

    return () => {
      cancelled = true;
    };
  }, [order]);

  if (!order) return null;

  const next = workflowNextStatus(order.status);

  const handleAdvance = async () => {
    if (!next) return;
    setAdvancing(true);
    setAdvanceError(null);
    try {
      const updated = await updateStatusFor(order._id, next);
      setTimeline((prev) => [
        ...prev,
        {
          _id: `local-${Date.now()}`,
          action: "STATUS_UPDATED",
          previousStatus: order.status,
          currentStatus: updated?.status || next,
          performedBy: "ADMIN",
          createdAt: new Date().toISOString()
        }
      ]);
      order.status = updated?.status || next;
    } catch (err) {
      setAdvanceError(err.message || "Couldn't update status.");
    } finally {
      setAdvancing(false);
    }
  };

  return (
    <AnimatePresence>
      {order && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-[var(--border)] bg-[var(--surface-raised)] shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-raised)] px-5 py-4">
              <div>
                <p className="font-mono text-sm font-semibold text-[var(--accent)]">
                  {order.orderId}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{order.customerName}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-[var(--border)] p-4">
                <Info label="Phone" value={formatPhone(order.phoneNumber)} mono />
                <Info label="Amount" value={formatCurrency(order.amount)} mono />
                <Info label="Product" value={order.productName} />
                <Info label="Created" value={formatDateTime(order.createdAt)} mono />
                <div>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--text-faint)]">
                    Status
                  </p>
                  <StatusBadge status={order.status} />
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--text-faint)]">
                    Payment
                  </p>
                  <PaymentBadge status={order.paymentStatus} />
                </div>
              </div>

              {next && (
                <div className="rounded-xl border border-dashed border-[var(--border)] p-4">
                  <p className="mb-2 text-xs text-[var(--text-muted)]">
                    Move this order forward in the pipeline manually — the scheduler
                    otherwise promotes stale <span className="font-mono">PLACED</span> orders automatically.
                  </p>
                  <button
                    onClick={handleAdvance}
                    disabled={advancing}
                    className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3.5 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60"
                  >
                    {advancing ? (
                      <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                      <ArrowRight size={14} />
                    )}
                    Mark as {ORDER_STATUS_META[next]?.label}
                  </button>
                  {advanceError && (
                    <p className="mt-2 text-xs text-[var(--status-cancelled)]">{advanceError}</p>
                  )}
                </div>
              )}

              <div>
                <h3 className="mb-3 font-display text-sm font-semibold text-[var(--text)]">
                  Status history
                </h3>

                {loadingTimeline && (
                  <p className="text-xs text-[var(--text-muted)]">Loading timeline…</p>
                )}
                {timelineError && (
                  <p className="flex items-center gap-1.5 text-xs text-[var(--status-cancelled)]">
                    <Ban size={12} /> {timelineError}
                  </p>
                )}

                {!loadingTimeline && !timelineError && (
                  <ol className="relative ml-2 space-y-4 border-l border-[var(--border)] pl-5">
                    {timeline.length === 0 && (
                      <li className="text-xs text-[var(--text-muted)]">No history recorded yet.</li>
                    )}
                    {timeline.map((entry) => (
                      <li key={entry._id} className="relative">
                        <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                        <p className="text-xs font-semibold text-[var(--text)]">
                          {formatAction(entry)}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-[var(--text-muted)]">
                          {formatDateTime(entry.createdAt)} · {entry.performedBy}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Info({ label, value, mono }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--text-faint)]">
        {label}
      </p>
      <p className={`text-sm text-[var(--text)] ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function formatAction(entry) {
  if (entry.action === "ORDER_CREATED") return "Order created";
  if (entry.action === "ORDER_DELETED") return "Order deleted";
  if (entry.action === "STATUS_UPDATED") {
    return `${entry.previousStatus || "—"} → ${entry.currentStatus || "—"}`;
  }
  return entry.action;
}

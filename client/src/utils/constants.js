export const ORDER_STATUS = {
  PLACED: "PLACED",
  PROCESSING: "PROCESSING",
  READY_TO_SHIP: "READY_TO_SHIP",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// Order matters here — it mirrors the real fulfillment pipeline and
// drives the pipeline-rail visualization.
export const ORDER_STATUS_FLOW = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.READY_TO_SHIP,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED
];

export const ORDER_STATUS_META = {
  PLACED: { label: "Placed", var: "--status-placed" },
  PROCESSING: { label: "Processing", var: "--status-processing" },
  READY_TO_SHIP: { label: "Ready to ship", var: "--status-ready" },
  SHIPPED: { label: "Shipped", var: "--status-shipped" },
  DELIVERED: { label: "Delivered", var: "--status-delivered" },
  CANCELLED: { label: "Cancelled", var: "--status-cancelled" }
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};

export const PAYMENT_STATUS_META = {
  PENDING: { label: "Pending", var: "--pay-pending" },
  PAID: { label: "Paid", var: "--pay-paid" },
  FAILED: { label: "Failed", var: "--pay-failed" },
  REFUNDED: { label: "Refunded", var: "--pay-refunded" }
};

// The scheduler promotes PLACED -> PROCESSING every tick once an order
// has been sitting for ORDER_STALE_MINUTES. Purely informational on the
// frontend (mirrors the backend's cron docs) — used for the countdown hint.
export const SCHEDULER_INTERVAL_MINUTES = 5;
export const ORDER_STALE_MINUTES = 10;

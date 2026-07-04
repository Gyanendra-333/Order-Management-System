import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "../common/StatusBadge.jsx";
import PaymentBadge from "../common/PaymentBadge.jsx";
import { formatCurrency, formatDateTime, formatPhone } from "../../utils/formatters.js";

const columns = [
  { key: "orderId", label: "Order ID" },
  { key: "customerName", label: "Customer" },
  { key: "phoneNumber", label: "Phone" },
  { key: "productName", label: "Product" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "paymentStatus", label: "Payment" },
  { key: "createdAt", label: "Created" }
];

export default function OrdersTable({ orders, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[840px] border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-soft)]">
          <AnimatePresence initial={false}>
            {orders.map((order, i) => (
              <motion.tr
                key={order._id || order.orderId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                onClick={() => onRowClick(order)}
                className="cursor-pointer transition hover:bg-[var(--surface-hover)]"
              >
                <td className="px-5 py-3.5 font-mono text-[13px] font-medium text-[var(--accent)]">
                  {order.orderId}
                </td>
                <td className="px-5 py-3.5 text-sm text-[var(--text)]">
                  {order.customerName}
                </td>
                <td className="px-5 py-3.5 font-mono text-[13px] text-[var(--text-muted)]">
                  {formatPhone(order.phoneNumber)}
                </td>
                <td className="max-w-[180px] truncate px-5 py-3.5 text-sm text-[var(--text)]">
                  {order.productName}
                </td>
                <td className="px-5 py-3.5 font-mono text-[13px] font-medium text-[var(--text)]">
                  {formatCurrency(order.amount)}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-5 py-3.5">
                  <PaymentBadge status={order.paymentStatus} />
                </td>
                <td className="px-5 py-3.5 font-mono text-[12px] text-[var(--text-muted)]">
                  {formatDateTime(order.createdAt)}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

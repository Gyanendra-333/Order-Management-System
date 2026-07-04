import { PAYMENT_STATUS_META } from "../../utils/constants.js";

export default function PaymentBadge({ status }) {
  const meta = PAYMENT_STATUS_META[status] || { label: status, var: "--text-faint" };

  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium"
      style={{
        color: `var(${meta.var})`,
        background: `color-mix(in srgb, var(${meta.var}) 14%, transparent)`
      }}
    >
      {meta.label}
    </span>
  );
}

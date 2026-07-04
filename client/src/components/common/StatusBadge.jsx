import { ORDER_STATUS_META } from "../../utils/constants.js";

export default function StatusBadge({ status }) {
  const meta = ORDER_STATUS_META[status] || { label: status, var: "--text-faint" };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide font-mono whitespace-nowrap"
      style={{
        color: `var(${meta.var})`,
        borderColor: `color-mix(in srgb, var(${meta.var}) 40%, transparent)`,
        background: `color-mix(in srgb, var(${meta.var}) 12%, transparent)`
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: `var(${meta.var})` }}
      />
      {meta.label}
    </span>
  );
}

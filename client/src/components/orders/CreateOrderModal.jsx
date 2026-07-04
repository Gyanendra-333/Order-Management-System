import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, LoaderCircle } from "lucide-react";
import { useOrders } from "../../context/OrderContext.jsx";
import { PAYMENT_STATUS_META } from "../../utils/constants.js";

const initialForm = {
  customerName: "",
  phoneNumber: "",
  productName: "",
  amount: "",
  paymentStatus: "PENDING"
};

function validate(form) {
  const errors = {};
  if (!form.customerName.trim() || form.customerName.trim().length < 2) {
    errors.customerName = "Enter at least 2 characters.";
  }
  if (!/^[6-9]\d{9}$/.test(form.phoneNumber.trim())) {
    errors.phoneNumber = "Enter a valid 10-digit Indian mobile number.";
  }
  if (!form.productName.trim() || form.productName.trim().length < 2) {
    errors.productName = "Enter a product name.";
  }
  if (!form.amount || Number(form.amount) <= 0) {
    errors.amount = "Amount must be greater than zero.";
  }
  return errors;
}

export default function CreateOrderModal({ open, onClose }) {
  const { createOrder } = useOrders();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleClose = () => {
    if (submitting) return;
    setForm(initialForm);
    setErrors({});
    setApiError(null);
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setApiError(null);
    try {
      await createOrder({
        ...form,
        amount: Number(form.amount)
      });
      handleClose();
    } catch (err) {
      setApiError(err.message || "Could not create the order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <motion.form
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 shadow-2xl"
            style={{ boxShadow: `0 20px 60px var(--shadow-color)` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[var(--text)]">
                New order
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md p-1 text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              <Field label="Customer name" error={errors.customerName}>
                <input
                  value={form.customerName}
                  onChange={handleChange("customerName")}
                  placeholder="Asha Verma"
                  className="input"
                />
              </Field>

              <Field label="Phone number" error={errors.phoneNumber}>
                <input
                  value={form.phoneNumber}
                  onChange={handleChange("phoneNumber")}
                  placeholder="9876543210"
                  inputMode="numeric"
                  className="input font-mono"
                />
              </Field>

              <Field label="Product name" error={errors.productName}>
                <input
                  value={form.productName}
                  onChange={handleChange("productName")}
                  placeholder="Wireless earbuds"
                  className="input"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Amount (₹)" error={errors.amount}>
                  <input
                    value={form.amount}
                    onChange={handleChange("amount")}
                    placeholder="1499"
                    type="number"
                    min="1"
                    className="input font-mono"
                  />
                </Field>

                <Field label="Payment status">
                  <select
                    value={form.paymentStatus}
                    onChange={handleChange("paymentStatus")}
                    className="input"
                  >
                    {Object.entries(PAYMENT_STATUS_META).map(([value, meta]) => (
                      <option key={value} value={value}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            {apiError && (
              <p className="mt-3 rounded-lg bg-[color-mix(in_srgb,var(--status-cancelled)_12%,transparent)] px-3 py-2 text-xs text-[var(--status-cancelled)]">
                {apiError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-hover)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#0a0e12] transition hover:brightness-110 disabled:opacity-60"
              >
                {submitting && <LoaderCircle size={14} className="animate-spin" />}
                Create order
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[var(--text-muted)]">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-[var(--status-cancelled)]">{error}</span>}
    </label>
  );
}

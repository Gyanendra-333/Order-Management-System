import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar.jsx";
import PipelineRail from "../components/layout/PipelineRail.jsx";
import FilterBar from "../components/orders/FilterBar.jsx";
import OrdersTable from "../components/orders/OrdersTable.jsx";
import Pagination from "../components/common/Pagination.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import SchedulerPulse from "../components/common/SchedulerPulse.jsx";
import CreateOrderModal from "../components/orders/CreateOrderModal.jsx";
import OrderDetailDrawer from "../components/orders/OrderDetailDrawer.jsx";
import { useOrders } from "../context/OrderContext.jsx";

export default function Dashboard() {
  const { orders, meta, limit, setPage, loading, error, refresh, status, updateStatus } =
    useOrders();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <PipelineRail />

      <main className="mx-auto max-w-6xl px-5 py-6">
        <div className="mb-3 md:hidden">
          <SchedulerPulse />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
        >
          <FilterBar onCreateClick={() => setCreateOpen(true)} />

          {loading && <LoadingState />}

          {!loading && error && <ErrorState message={error} onRetry={refresh} />}

          {!loading && !error && orders.length === 0 && (
            <EmptyState
              title="No orders match this view"
              message={
                status
                  ? "Nothing is currently in this status. Try clearing the filter."
                  : "Create your first order to see it show up here."
              }
              actionLabel={status ? "Clear filter" : "Create an order"}
              onAction={() => (status ? updateStatus("") : setCreateOpen(true))}
            />
          )}

          {!loading && !error && orders.length > 0 && (
            <>
              <OrdersTable orders={orders} onRowClick={setSelectedOrder} />
              <Pagination
                currentPage={meta.currentPage}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={limit}
                onChange={setPage}
              />
            </>
          )}
        </motion.div>
      </main>

      <CreateOrderModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <OrderDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  fetchOrders,
  createOrder as apiCreateOrder,
  updateOrderStatus as apiUpdateOrderStatus,
  fetchSchedulerStatus
} from "../api/orderApi.js";
import { ORDER_STATUS } from "../utils/constants.js";

const OrderContext = createContext(null);

const AUTO_REFRESH_MS = 30000;

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ total: 0, currentPage: 1, totalPages: 1 });

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});

  const searchDebounceRef = useRef(null);
  const isFirstLoadRef = useRef(true);

  const loadOrders = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const result = await fetchOrders({ page, limit, status, search });
        setOrders(result.orders || []);
        setMeta({
          total: result.total ?? 0,
          currentPage: result.currentPage ?? page,
          totalPages: result.totalPages ?? 1
        });
        setLastFetchedAt(new Date());
      } catch (err) {
        setError(err.message || "Failed to load orders.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, status, search]
  );

  const loadStatusCounts = useCallback(async () => {
    try {
      const statuses = Object.values(ORDER_STATUS);
      const results = await Promise.all(
        statuses.map((s) => fetchOrders({ page: 1, limit: 1, status: s }))
      );
      const counts = {};
      statuses.forEach((s, i) => {
        counts[s] = results[i]?.total ?? 0;
      });
      setStatusCounts(counts);
    } catch {
      // Rail is a nice-to-have overview — fail silently on transient errors.
    }
  }, []);

  const loadSchedulerStatus = useCallback(async () => {
    try {
      const result = await fetchSchedulerStatus();
      setSchedulerStatus(result);
    } catch {
      // Non-critical widget — fail silently, keep last known value.
    }
  }, []);

  // Initial + whenever page/status/search change
  useEffect(() => {
    loadOrders({ silent: !isFirstLoadRef.current });
    isFirstLoadRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, search]);

  useEffect(() => {
    loadSchedulerStatus();
    loadStatusCounts();
    const id = setInterval(() => {
      loadSchedulerStatus();
      loadStatusCounts();
    }, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [loadSchedulerStatus, loadStatusCounts]);

  // Reset to page 1 whenever filters change
  const updateStatus = useCallback((next) => {
    setStatus(next);
    setPage(1);
  }, []);

  const updateSearch = useCallback((value) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 350);
  }, []);

  const refresh = useCallback(() => {
    loadOrders({ silent: true });
    loadSchedulerStatus();
    loadStatusCounts();
  }, [loadOrders, loadSchedulerStatus, loadStatusCounts]);

  const createOrder = useCallback(
    async (payload) => {
      const order = await apiCreateOrder(payload);
      await loadOrders({ silent: true });
      loadStatusCounts();
      return order;
    },
    [loadOrders, loadStatusCounts]
  );

  const updateStatusFor = useCallback(
    async (id, nextStatus) => {
      const order = await apiUpdateOrderStatus(id, nextStatus);
      await loadOrders({ silent: true });
      loadStatusCounts();
      return order;
    },
    [loadOrders, loadStatusCounts]
  );

  const value = useMemo(
    () => ({
      orders,
      meta,
      status,
      search,
      page,
      limit,
      loading,
      refreshing,
      error,
      schedulerStatus,
      lastFetchedAt,
      statusCounts,
      setPage,
      updateStatus,
      updateSearch,
      refresh,
      createOrder,
      updateStatusFor
    }),
    [
      orders,
      meta,
      status,
      search,
      page,
      limit,
      loading,
      refreshing,
      error,
      schedulerStatus,
      lastFetchedAt,
      statusCounts,
      updateStatus,
      updateSearch,
      refresh,
      createOrder,
      updateStatusFor
    ]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}

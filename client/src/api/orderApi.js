import axiosClient from "./axiosClient.js";

/**
 * All functions return `response.data.data` — the payload — and let
 * errors bubble up (already normalized by the axios interceptor).
 */

export async function fetchOrders({ page = 1, limit = 10, status, search, sort } = {}) {
  const params = { page, limit };
  if (status) params.status = status;
  if (search) params.search = search;
  if (sort) params.sort = sort;

  const { data } = await axiosClient.get("/orders", { params });
  return data.data; // { total, currentPage, totalPages, orders }
}

export async function fetchOrderById(id) {
  const { data } = await axiosClient.get(`/orders/${id}`);
  return data.data;
}

export async function createOrder(payload) {
  const { data } = await axiosClient.post("/orders", payload);
  return data.data;
}

export async function updateOrder(id, payload) {
  const { data } = await axiosClient.put(`/orders/${id}`, payload);
  return data.data;
}

export async function updateOrderStatus(id, status) {
  const { data } = await axiosClient.patch(`/orders/${id}/status`, { status });
  return data.data;
}

export async function deleteOrder(id) {
  const { data } = await axiosClient.delete(`/orders/${id}`);
  return data.data;
}

export async function fetchOrderTimeline(id) {
  const { data } = await axiosClient.get(`/orders/${id}/timeline`);
  // NOTE: the backend's getOrderTimeline controller constructs
  // `new ApiResponse(200, logs, "Timeline fetched successfully.")` —
  // the arguments are in the wrong order for that class (success, message, data),
  // so the actual timeline array arrives in `data.message`, not `data.data`.
  // We read defensively so this keeps working if the backend is ever corrected.
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.message)) return data.message;
  return [];
}

export async function fetchSchedulerStatus() {
  const { data } = await axiosClient.get("/scheduler/status");
  return data.data;
}

import { ORDER_STATUS } from "./constants.js";

// Mirrors server/src/utils/orderWorkflow.js — kept in sync manually since
// the backend is not to be modified. Only used to decide which single
// "advance" action to offer in the UI; the backend still re-validates
// every transition and is the source of truth.
const NEXT_STEP = {
  [ORDER_STATUS.PLACED]: ORDER_STATUS.PROCESSING,
  [ORDER_STATUS.PROCESSING]: ORDER_STATUS.READY_TO_SHIP,
  [ORDER_STATUS.READY_TO_SHIP]: ORDER_STATUS.SHIPPED,
  [ORDER_STATUS.SHIPPED]: ORDER_STATUS.DELIVERED,
  [ORDER_STATUS.DELIVERED]: null,
  [ORDER_STATUS.CANCELLED]: null
};

export default function workflowNextStatus(currentStatus) {
  return NEXT_STEP[currentStatus] || null;
}

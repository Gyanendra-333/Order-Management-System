# Order Control — React Dashboard

Frontend for the Order Management System. Built with **React + Vite**, **Tailwind CSS v4**,
**Framer Motion**, and the **Context API** for state management (no Redux/Zustand).

This app only *reads and writes* against the existing backend — nothing in
`server/` was touched.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first config, no `tailwind.config.js` needed)
- Framer Motion — page/row transitions, the pipeline rail's live pulse, the scheduler heartbeat, drawer/modal motion
- Axios — API client with a single interceptor that normalizes error messages
- React Context API — `ThemeContext` (dark/light) and `OrderContext` (orders, filters, pagination, scheduler status)
- lucide-react — icons

## Getting started

\`\`\`bash
cd client
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your running backend
npm run dev
\`\`\`

The app runs on \`http://localhost:5173\` by default and expects the backend at
\`http://localhost:5000/api\` (matches the backend's own \`.env.example\`).

## Environment variables

| Variable            | Description                    | Default                     |
|---------------------|---------------------------------|------------------------------|
| \`VITE_API_BASE_URL\` | Base URL of the backend API     | \`http://localhost:5000/api\` |

## Folder structure

\`\`\`
client/src/
├── api/              # axios instance + one function per backend endpoint
├── context/          # ThemeContext (dark/light), OrderContext (orders state)
├── components/
│   ├── layout/         # Navbar, PipelineRail (signature status-flow visual)
│   ├── common/         # StatusBadge, PaymentBadge, Loading/Empty/Error states,
│   │                    # Pagination, SchedulerPulse
│   └── orders/         # FilterBar, OrdersTable, CreateOrderModal, OrderDetailDrawer
├── pages/             # Dashboard (the single screen this app has)
└── utils/             # constants, formatters, client-side workflow mirror
\`\`\`

## Features

- **Status dropdown filter** + the pipeline rail nodes are also clickable filters
- **Search** by order ID or customer name (debounced, hits the backend's \`search\` query param)
- **Orders table**: order ID, customer, phone, product, amount, status, payment status, created time
- **Loading state**: animated skeleton rows
- **Empty state**: contextual message + action (clear filter / create order)
- **Error state**: retry button, backend error message surfaced as-is
- **Auto-refresh button** with a spin animation while refreshing, plus a background poll
  every 30s for the scheduler widget and pipeline counts
- **Pagination** (bonus) — driven by the backend's \`page\`/\`limit\`/\`total\`/\`totalPages\`
- **Create order modal** — client-side validation mirrors the backend's express-validator rules
  (10-digit Indian mobile number, amount > 0, etc.) so bad input never round-trips
- **Order detail drawer** — shows the full status history timeline (\`GET /orders/:id/timeline\`)
  and a one-click "advance to next status" action that calls \`PATCH /orders/:id/status\`
- **Scheduler pulse widget** — reads \`GET /scheduler/status\`, shows last run time, orders
  updated, success/failure, and a live countdown to the next expected tick (client-side only,
  computed from the 5-minute cron interval — purely informational)
- **Dark / light theme toggle** — persisted to \`localStorage\`, respects
  \`prefers-color-scheme\` on first load

## Design notes

The visual direction is a **"control tower" console**: dark graphite surfaces, a monospace
face (JetBrains Mono) for anything data-like (order IDs, amounts, timestamps), Sora for
headings, Inter for body text. The signature element is the **pipeline rail** — a horizontal
node-per-status track with live counts and a pulsing "signal" dot, because orders in this
system genuinely move through a fixed sequence of stages, so a flow visualization is honest
to the content rather than decorative.

## Known backend quirk handled defensively

\`GET /api/orders/:id/timeline\` constructs its response as
\`new ApiResponse(200, logs, "message")\`, but \`ApiResponse\`'s constructor signature is
\`(success, message, data)\`. That means the timeline array actually arrives in the response's
\`message\` field, not \`data\`. Since the backend isn't being modified for this task,
\`src/api/orderApi.js#fetchOrderTimeline\` checks \`data.data\` first and falls back to
\`data.message\`, so the UI works correctly either way and will keep working if that's fixed later.

## Scripts

\`\`\`bash
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
\`\`\`

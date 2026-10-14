import { setupWorker } from "msw/browser";
import { authHandlers } from "./authHandlers";
import { handlers } from "./handlers";
import { orderHandlers } from "./orderHandlers";

// Registra o listener WebSocket separadamente dos handlers HTTP.
import "./socketHandlers";

export const worker = setupWorker(
  ...authHandlers,
  ...handlers,
  ...orderHandlers,
);

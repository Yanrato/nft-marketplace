
import { setupWorker } from "msw/browser";
import { authHandlers } from "./authHandlers";
import { handlers } from "./handlers";
import { orderHandlers } from "./orderHandlers";
import { socketHandlers } from "./socketHandlers";

export const worker = setupWorker(
  ...socketHandlers,
  ...authHandlers,
  ...handlers,
  ...orderHandlers,
);

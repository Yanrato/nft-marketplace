import { setupWorker } from "msw/browser";
import { authHandlers } from "./authHandlers";
import { handlers } from "./handlers";
import { orderHandlers } from "./orderHandlers";

export const worker = setupWorker(
  ...authHandlers,
  ...handlers,
  ...orderHandlers,
);

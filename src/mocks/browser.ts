import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { orderHandlers } from "./orderHandlers";

export const worker = setupWorker(
  ...handlers,
  ...orderHandlers
);

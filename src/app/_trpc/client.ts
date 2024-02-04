import { createTRPCReact } from "@trpc/react-query";

import { AppRouter } from "src/server";

export const trpc = createTRPCReact<AppRouter>({});

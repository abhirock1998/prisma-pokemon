import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "src/server";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    // You can also pass in `transformer` and `fetchOptions` here,
    router: appRouter,
    createContext: () => {
      return {
        // You can add stuff to the context here
      };
    },
  });
export { handler as GET, handler as POST };

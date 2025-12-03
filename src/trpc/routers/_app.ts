import { credentialsRouter } from "@/modules/credentials/server/routers";
import { createTRPCRouter } from "../init";
import { workflowsRouter } from "@/modules/workflows/server/routers";
import { executionsRouter } from "@/modules/executions/server/routers";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

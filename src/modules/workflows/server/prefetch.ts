import type { inferInput } from "@trpc/tanstack-react-query";
import { trpc, prefetch } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflows.getMany>;

export const prefetchWorkflows = (input: Input) => {
  return prefetch(trpc.workflows.getMany.queryOptions(input));
};

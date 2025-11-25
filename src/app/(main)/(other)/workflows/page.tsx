import { requireAuth } from "@/modules/auth/lib/auth.utils";
import {
  WorkflowsContainer,
  WorkflowsError,
  WorkflowsList,
  WorkflowsLoading,
} from "@/modules/workflows/components/workflows";
import { workflowsParamsLoader } from "@/modules/workflows/server/params-loader";
import { prefetchWorkflows } from "@/modules/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: PageProps) => {
  await requireAuth();
  const params = workflowsParamsLoader(await searchParams);

  prefetchWorkflows(params);

  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsError />}>
          <Suspense fallback={<WorkflowsLoading />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
};

export default Page;

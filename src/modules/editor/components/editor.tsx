"use client";

import { useSuspenseWorkflow } from "@/modules/workflows/hooks/use-workflows";

const Editor = ({ workflowId }: { workflowId: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  return <p></p>;
};

export default Editor;

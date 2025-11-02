import { useQueryStates } from "nuqs";
import { workflowsParams } from "@/modules/workflows/lib/params";

export const useWorkflowsParams = () => {
  return useQueryStates(workflowsParams);
};

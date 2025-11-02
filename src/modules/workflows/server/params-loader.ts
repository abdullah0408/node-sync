import { createLoader } from "nuqs/server";
import { workflowsParams } from "@/modules/workflows/lib/params";

export const workflowsParamsLoader = createLoader(workflowsParams);

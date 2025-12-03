import { createLoader } from "nuqs/server";
import { executionsParams } from "../lib/params";

export const executionsParamsLoader = createLoader(executionsParams);

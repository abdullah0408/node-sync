import { useQueryStates } from "nuqs";
import { executionsParams } from "../lib/params";

export const useExecutionsParams = () => {
  return useQueryStates(executionsParams);
};

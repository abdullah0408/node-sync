import { useQueryStates } from "nuqs";
import { credentialsParams } from "../lib/params";

export const useCredentialsParams = () => {
  return useQueryStates(credentialsParams);
};

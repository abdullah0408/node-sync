import { createLoader } from "nuqs/server";
import { credentialsParams } from "../lib/params";

export const credentialsParamsLoader = createLoader(credentialsParams);

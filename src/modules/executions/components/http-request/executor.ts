import { NonRetriableError } from "inngest";
import ky, { type Options as Kyoptions } from "ky";
import type { NodeExecutor } from "../../lib/types";

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  // nodeId,
  context,
  step,
}) => {
  // TODO: Publish "loading" state for Http Request

  if (!data.endpoint) {
    // TODO: Publish "error" state for Http Request
    throw new NonRetriableError("HTTP Request Node: No Endpoint configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";

    const options: Kyoptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  // TODO: Publish "success" state for Http Request
  return result;
};

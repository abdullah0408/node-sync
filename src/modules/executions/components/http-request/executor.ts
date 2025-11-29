import { NonRetriableError } from "inngest";
import ky, { type Options as Kyoptions } from "ky";
import type { NodeExecutor } from "../../lib/types";
import Handlebars from "handlebars";

Handlebars.registerHelper("json", (context) => {
  const strigified = JSON.stringify(context);
  const safeString = new Handlebars.SafeString(strigified);

  return safeString;
});

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
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

  if (!data.variableName) {
    // TODO: Publish "error" state for Http Request
    throw new NonRetriableError("Variable name not configured");
  }

  if (!data.method) {
    // TODO: Publish "error" state for Http Request
    throw new NonRetriableError("HTTP method not configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const method = data.method;
    const options: Kyoptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body || "{}")(context);
      JSON.parse(resolved); // Check for valid JSON
      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  // TODO: Publish "success" state for Http Request
  return result;
};

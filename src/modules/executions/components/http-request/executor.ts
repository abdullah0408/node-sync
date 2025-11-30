import { NonRetriableError } from "inngest";
import ky, { type Options as Kyoptions } from "ky";
import type { NodeExecutor } from "../../lib/types";
import Handlebars from "handlebars";
import { HttpReqestChannel } from "@/inngest/channels/http-request";

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
  nodeId,
  context,
  step,
  publish,
}) => {
  // TODO: Publish "loading" state for Http Request
  await publish(
    HttpReqestChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.endpoint) {
    await publish(
      HttpReqestChannel().status({
        nodeId,
        status: "error",
      })
    );
    // TODO: Publish "error" state for Http Request
    throw new NonRetriableError("HTTP Request Node: No Endpoint configured");
  }

  if (!data.variableName) {
    await publish(
      HttpReqestChannel().status({
        nodeId,
        status: "error",
      })
    );
    // TODO: Publish "error" state for Http Request
    throw new NonRetriableError("Variable name not configured");
  }

  if (!data.method) {
    await publish(
      HttpReqestChannel().status({
        nodeId,
        status: "error",
      })
    );
    // TODO: Publish "error" state for Http Request
    throw new NonRetriableError("HTTP method not configured");
  }

  try {
    const result = await step.run("http-request", async () => {
      const endpoint = Handlebars.compile(data.endpoint)(context);
      const method = data.method;

      const options: Kyoptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const resolved = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(resolved); // Validate JSON
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

    await publish(
      HttpReqestChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (err) {
    await publish(
      HttpReqestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw err;
  }
};

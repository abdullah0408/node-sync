import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";
import { SlackChannel } from "@/inngest/channels/slack";
import { NodeExecutor } from "../../lib/types";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(stringified);
});

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const SlackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    SlackChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.variableName) {
    await publish(
      SlackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Error: variable name is missing");
  }

  if (!data.content) {
    await publish(
      SlackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Error: content is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(
          SlackChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Error: webhook is missing");
      }

      await ky.post(data.webhookUrl, {
        json: {
          content: content,
        },
      });

      if (!data.variableName) {
        await publish(
          SlackChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Error: variable name is missing");
      }

      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await publish(
      SlackChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch {
    await publish(
      SlackChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new Error();
  }
};

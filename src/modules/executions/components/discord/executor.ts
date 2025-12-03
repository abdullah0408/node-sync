import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";
import { DiscordChannel } from "@/inngest/channels/discord";
import { NodeExecutor } from "../../lib/types";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(stringified);
});

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const DiscordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    DiscordChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.variableName) {
    await publish(
      DiscordChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Error: variable name is missing");
  }

  if (!data.content) {
    await publish(
      DiscordChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Error: content is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run("discord-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(
          DiscordChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Error: webhook is missing");
      }

      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000), // discord max lentgh,
          username,
        },
      });

      if (!data.variableName) {
        await publish(
          DiscordChannel().status({
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
      DiscordChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch {
    await publish(
      DiscordChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new Error();
  }
};

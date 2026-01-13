import { AnthropicChannel } from "@/inngest/channels/anthropic";
import { decrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../../lib/types";
import { AVAILABLE_MODELS } from "./dialog";

Handlebars.registerHelper("json", (context) => {
  const strigified = JSON.stringify(context);
  const safeString = new Handlebars.SafeString(strigified);

  return safeString;
});

type AnthropicModel = (typeof AVAILABLE_MODELS)[number];

type AnthropicData = {
  variableName: string;
  model?: AnthropicModel;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const AnthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  await publish(
    AnthropicChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.variableName) {
    await publish(
      AnthropicChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("Anthropic Node: Variable Name is required");
  }

  if (!data.credentialId) {
    await publish(
      AnthropicChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("Anthropic Node: Credential id required");
  }

  if (!data.userPrompt) {
    await publish(
      AnthropicChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("Anthropic Node: User Prompt is Missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId,
        userId,
      },
    });
  });

  if (!credential) {
    await publish(
      AnthropicChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Credential not found");
  }

  const anthropic = createAnthropic({
    apiKey: decrypt(credential.value),
  });

  try {
    const { steps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic(data.model || "claude-sonnet-4-20250514"),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      AnthropicChannel().status({
        nodeId,
        status: "success",
      })
    );

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      AnthropicChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};

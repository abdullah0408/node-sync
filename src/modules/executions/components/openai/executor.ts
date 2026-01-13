import { OpenAIChannel } from "@/inngest/channels/openai";
import { decrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { createOpenAI } from "@ai-sdk/openai";
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

type OpenAIModel = (typeof AVAILABLE_MODELS)[number];

type OpenAIData = {
  variableName: string;
  model?: OpenAIModel;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const OpenAIExecutor: NodeExecutor<OpenAIData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  await publish(
    OpenAIChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.variableName) {
    await publish(
      OpenAIChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("OpenAI Node: Variable Name is required");
  }

  if (!data.credentialId) {
    await publish(
      OpenAIChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("OpenAI Node: Credential id required");
  }

  if (!data.userPrompt) {
    await publish(
      OpenAIChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("OpenAI Node: User Prompt is Missing");
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
      OpenAIChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Credential not found");
  }

  const openai = createOpenAI({
    apiKey: decrypt(credential.value),
  });

  try {
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai(data.model || "gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      OpenAIChannel().status({
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
      OpenAIChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};

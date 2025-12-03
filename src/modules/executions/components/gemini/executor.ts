import { GeminiChannel } from "@/inngest/channels/gemini";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../../lib/types";
import { AVAILABLE_MODELS } from "./dialog";
import prisma from "@/lib/prisma";

Handlebars.registerHelper("json", (context) => {
  const strigified = JSON.stringify(context);
  const safeString = new Handlebars.SafeString(strigified);

  return safeString;
});

type GeminiModel = (typeof AVAILABLE_MODELS)[number];

type GeminiData = {
  variableName: string;
  model?: GeminiModel;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};
export const GeminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  // TODO: Publish "loading" state for Http Request
  await publish(
    GeminiChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.variableName) {
    await publish(
      GeminiChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("Gemini Node: Variable Name is required");
  }

  if (!data.credentialId) {
    await publish(
      GeminiChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("Error: Credential id required");
  }

  if (!data.userPrompt) {
    await publish(
      GeminiChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("Gemini Node: User Prompt is Missing");
  }

  // TODO: Throw if credentials are missing

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // TODO: Fetch credentials that user selected

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
      GeminiChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Credential not found");
  }
  const google = createGoogleGenerativeAI({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google("gemini-2.0-flash"),
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
      GeminiChannel().status({
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
      GeminiChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};

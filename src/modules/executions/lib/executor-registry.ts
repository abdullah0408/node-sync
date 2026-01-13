import { NodeType } from "@/generated/prisma/enums";
import { googleFormTriggerExecutor } from "@/modules/triggers/components/google-form-trigger/executor";
import { manualTriggerExecutor } from "@/modules/triggers/components/manual-trigger/executor";
import { AnthropicExecutor } from "../components/anthropic/executor";
import { DiscordExecutor } from "../components/discord/executor";
import { GeminiExecutor } from "../components/gemini/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { OpenAIExecutor } from "../components/openai/executor";
import { SlackExecutor } from "../components/slack/executor";
import { NodeExecutor } from "./types";

export const executorRegistry: Partial<Record<NodeType, NodeExecutor>> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor as NodeExecutor<
    Record<string, unknown>
  >,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.GEMINI]: GeminiExecutor as NodeExecutor<Record<string, unknown>>,
  [NodeType.OPENAI]: OpenAIExecutor as NodeExecutor<Record<string, unknown>>,
  [NodeType.ANTHROPIC]: AnthropicExecutor as NodeExecutor<
    Record<string, unknown>
  >,
  [NodeType.DISCORD]: DiscordExecutor,
  [NodeType.SLACK]: SlackExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};

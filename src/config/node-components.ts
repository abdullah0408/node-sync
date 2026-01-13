import { NodeType } from "@/generated/prisma/enums";
import { InitialNode } from "@/modules/editor/components/initial-node";
import { AnthropicNode } from "@/modules/executions/components/anthropic/node";
import { DiscordNode } from "@/modules/executions/components/discord/node";
import { GeminiNode } from "@/modules/executions/components/gemini/node";
import { HttpRequestNode } from "@/modules/executions/components/http-request/node";
import { OpenAINode } from "@/modules/executions/components/openai/node";
import { SlackNode } from "@/modules/executions/components/slack/node";
import { GoogleFormNode } from "@/modules/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/modules/triggers/components/manual-trigger/node";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAINode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.SLACK]: SlackNode,
} as const satisfies NodeTypes;

export type RegisteredNodeTypes = keyof typeof nodeComponents;

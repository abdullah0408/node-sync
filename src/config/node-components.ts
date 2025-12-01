import { NodeType } from "@/generated/prisma/enums";
import { InitialNode } from "@/modules/editor/components/initial-node";
import { HttpRequestNode } from "@/modules/executions/components/http-request/node";
import { GoogleFormNode } from "@/modules/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/modules/triggers/components/manual-trigger/node";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormNode,
} as const satisfies NodeTypes;

export type RegisteredNodeTypes = keyof typeof nodeComponents;

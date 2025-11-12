import { NodeType } from "@/generated/prisma/enums";
import { InitialNode } from "@/modules/editor/components/initial-node";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type RegisteredNodeTypes = keyof typeof nodeComponents;

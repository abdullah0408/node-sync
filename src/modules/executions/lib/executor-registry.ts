import { NodeType } from "@/generated/prisma/enums";
import { manualTriggerExecutor } from "@/modules/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { NodeExecutor } from "./types";
import { googleFormTriggerExecutor } from "@/modules/triggers/components/google-form-trigger/executor";

export const executorRegistry: Partial<Record<NodeType, NodeExecutor>> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor as NodeExecutor<
    Record<string, unknown>
  >,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};

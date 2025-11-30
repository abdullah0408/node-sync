import { channel, topic } from "@inngest/realtime";

export const MANUAL_TRIGGER_CHANNEL_NAME = "manual-trigger-execution";
export const ManualTriggerChannel = channel(
  MANUAL_TRIGGER_CHANNEL_NAME
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "error" | "success";
  }>()
);

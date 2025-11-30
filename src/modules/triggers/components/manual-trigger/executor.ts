import type { NodeExecutor } from "@/modules/executions/lib/types";
import { ManualTriggerChannel } from "@/inngest/channels/mannual-triggers";

type ManualTriggerData = Record<string, unknown>;
export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  // TODO: Publish "loading" state for manual trigger

  await publish(
    ManualTriggerChannel().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run("manual-trigger", async () => context);

  // TODO: Publish "success" state for manual trigger
  await publish(
    ManualTriggerChannel().status({
      nodeId,
      status: "success",
    })
  );
  return result;
};

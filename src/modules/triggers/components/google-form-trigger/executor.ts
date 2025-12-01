import type { NodeExecutor } from "@/modules/executions/lib/types";
import { GoogleFormTriggerChannel } from "@/inngest/channels/google-from-trigger";

type GoogleFormTriggerData = Record<string, unknown>;
export const googleFormTriggerExecutor: NodeExecutor<
  GoogleFormTriggerData
> = async ({ nodeId, context, step, publish }) => {
  await publish(
    GoogleFormTriggerChannel().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run("google-form-trigger", async () => context);

  // TODO: Publish "success" state for google trigger
  await publish(
    GoogleFormTriggerChannel().status({
      nodeId,
      status: "success",
    })
  );

  return result;
};

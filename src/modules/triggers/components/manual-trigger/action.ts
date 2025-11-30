"use server";

import { ManualTriggerChannel } from "@/inngest/channels/mannual-triggers";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type MannualTriggerToken = Realtime.Token<
  typeof ManualTriggerChannel,
  ["status"]
>;

export async function fetchManualTriggerRealTimeToken(): Promise<MannualTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: ManualTriggerChannel(),
    topics: ["status"],
  });

  return token;
}

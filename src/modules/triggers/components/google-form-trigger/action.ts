"use server";

import { GoogleFormTriggerChannel } from "@/inngest/channels/google-from-trigger";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type GoogleFormTriggerToken = Realtime.Token<
  typeof GoogleFormTriggerChannel,
  ["status"]
>;

export async function fetchGoogleFormTriggerRealTimeToken(): Promise<GoogleFormTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: GoogleFormTriggerChannel(),
    topics: ["status"],
  });

  return token;
}

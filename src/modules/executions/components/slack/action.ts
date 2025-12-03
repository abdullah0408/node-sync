"use server";

import { SlackChannel } from "@/inngest/channels/slack";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type SlackToken = Realtime.Token<typeof SlackChannel, ["status"]>;

export async function fetchSlackRealTimeToken(): Promise<SlackToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: SlackChannel(),
    topics: ["status"],
  });

  return token;
}

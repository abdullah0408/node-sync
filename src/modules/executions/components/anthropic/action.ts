"use server";

import { AnthropicChannel } from "@/inngest/channels/anthropic";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type AnthropicToken = Realtime.Token<
  typeof AnthropicChannel,
  ["status"]
>;

export async function fetchAnthropicRealTimeToken(): Promise<AnthropicToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: AnthropicChannel(),
    topics: ["status"],
  });

  return token;
}

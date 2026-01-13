"use server";

import { OpenAIChannel } from "@/inngest/channels/openai";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type OpenAIToken = Realtime.Token<typeof OpenAIChannel, ["status"]>;

export async function fetchOpenAIRealTimeToken(): Promise<OpenAIToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: OpenAIChannel(),
    topics: ["status"],
  });

  return token;
}

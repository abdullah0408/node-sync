"use server";

import { GeminiChannel } from "@/inngest/channels/gemini";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type GeminiToken = Realtime.Token<typeof GeminiChannel, ["status"]>;

export async function fetchGeminiRealTimeToken(): Promise<GeminiToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: GeminiChannel(),
    topics: ["status"],
  });

  return token;
}

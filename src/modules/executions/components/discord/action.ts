"use server";

import { DiscordChannel } from "@/inngest/channels/discord";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type DiscordToken = Realtime.Token<typeof DiscordChannel, ["status"]>;

export async function fetchDiscordRealTimeToken(): Promise<DiscordToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: DiscordChannel(),
    topics: ["status"],
  });

  return token;
}

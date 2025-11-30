"use server";

import { HttpReqestChannel } from "@/inngest/channels/http-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type HttpReqestToken = Realtime.Token<
  typeof HttpReqestChannel,
  ["status"]
>;

export async function fetchHttpRequestRealTimeToken(): Promise<HttpReqestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: HttpReqestChannel(),
    topics: ["status"],
  });

  return token;
}

import { channel, topic } from "@inngest/realtime";

export const DISCORD_CHANNEL_NAME = "discord-execution";

export const DiscordChannel = channel(DISCORD_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "error" | "success";
  }>()
);

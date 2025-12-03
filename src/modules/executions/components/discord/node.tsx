"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { DiscordFormValues, DiscordDialog } from "./dialog";
import { fetchDiscordRealTimeToken } from "./action";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";
import { useNodeStatus } from "../../hooks/node-status";

type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleSetting = () => {
    setIsDialogOpen(true);
  };

  const status = useNodeStatus({
    nodeId: props.id,
    channel: DISCORD_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRealTimeToken,
  });

  const nodeData = props.data;
  const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  const handleSubmit = (values: DiscordFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <>
      <DiscordDialog
        onSubmit={handleSubmit}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/discord.svg"
        status={status}
        name="Discord"
        description={description}
        onSetting={handleSetting}
        onDoubleClick={handleSetting}
      />
    </>
  );
});

DiscordNode.displayName = "HttpRequetNode";

"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { SlackFormValues, SlackDialog } from "./dialog";
import { fetchSlackRealTimeToken } from "./action";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";
import { useNodeStatus } from "../../hooks/node-status";

type SlackNodeData = {
  webhookUrl?: string;
  content?: string;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleSetting = () => {
    setIsDialogOpen(true);
  };

  const status = useNodeStatus({
    nodeId: props.id,
    channel: SLACK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchSlackRealTimeToken,
  });

  const nodeData = props.data;
  const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  const handleSubmit = (values: SlackFormValues) => {
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
      <SlackDialog
        onSubmit={handleSubmit}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/slack.svg"
        status={status}
        name="Slack"
        description={description}
        onSetting={handleSetting}
        onDoubleClick={handleSetting}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";

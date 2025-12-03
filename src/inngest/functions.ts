import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { topologicalSort } from "./utils";
import type { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/modules/executions/lib/executor-registry";
import { HttpReqestChannel } from "./channels/http-request";
import { ManualTriggerChannel } from "./channels/mannual-triggers";
import { GoogleFormTriggerChannel } from "./channels/google-from-trigger";
import { GeminiChannel } from "./channels/gemini";
import { DiscordChannel } from "./channels/discord";
import { SlackChannel } from "./channels/slack";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute/workflow",
    retries: 0, //TODO: Not in Production,
  },
  {
    event: "workflow/execute.workflow",
    channels: [
      HttpReqestChannel(),
      ManualTriggerChannel(),
      GoogleFormTriggerChannel(),
      GeminiChannel(),
      DiscordChannel(),
      SlackChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("No workflow ID provided");
    }

    const sortedNodes = await step.run("prepare-nodes", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: {
          userId: true,
        },
      });

      return workflow.userId;
    });

    // Initialize the context with any initial data from the trigger
    let context = event.data.initialData || {};

    // Execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish,
      });
    }

    return {
      workflowId,
      result: context,
    };
  }
);

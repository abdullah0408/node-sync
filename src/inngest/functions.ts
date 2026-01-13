import { ExecutionStatus, type NodeType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getExecutor } from "@/modules/executions/lib/executor-registry";
import { NonRetriableError } from "inngest";
import { AnthropicChannel } from "./channels/anthropic";
import { DiscordChannel } from "./channels/discord";
import { GeminiChannel } from "./channels/gemini";
import { GoogleFormTriggerChannel } from "./channels/google-from-trigger";
import { HttpReqestChannel } from "./channels/http-request";
import { ManualTriggerChannel } from "./channels/mannual-triggers";
import { OpenAIChannel } from "./channels/openai";
import { SlackChannel } from "./channels/slack";
import { inngest } from "./client";
import { topologicalSort } from "./utils";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute/workflow",
    onFailure: async ({ event }) => {
      return prisma.execution.update({
        where: {
          inngestEventId: event.data.event.id,
        },
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message,
          errorStack: event.data.error.stack,
        },
      });
    },
  },
  {
    event: "workflow/execute.workflow",
    channels: [
      HttpReqestChannel(),
      ManualTriggerChannel(),
      GoogleFormTriggerChannel(),
      GeminiChannel(),
      OpenAIChannel(),
      AnthropicChannel(),
      DiscordChannel(),
      SlackChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!inngestEventId) {
      throw new NonRetriableError("Event ID is missing");
    }

    if (!workflowId) {
      throw new NonRetriableError("No workflow ID provided");
    }

    await step.run("create-execution", async () => {
      return prisma.execution.create({
        data: {
          workflowId,
          inngestEventId,
        },
      });
    });

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

    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context,
        },
      });
    });

    return {
      workflowId,
      result: context,
    };
  }
);

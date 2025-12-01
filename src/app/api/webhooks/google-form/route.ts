import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Required Query Parameter",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timeStamp: body.timeStamp,
      respondentEmai: body.respondentEmai,
      responses: body.responses,
      raw: body,
    };

    // Trigger an inggest job
    await sendWorkflowExecution({
      workflowId: workflowId!,
      initialData: {
        googleForm: formData,
      },
    });
  } catch (error) {
    console.error("Google form Webhook error", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process Google Form submission",
      },
      { status: 500 }
    );
  }
}

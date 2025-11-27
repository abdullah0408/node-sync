import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/modules/workflows/hooks/use-workflows";
import { FlaskConicalIcon } from "lucide-react";

export const ExcuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();

  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId });
  };

  return (
    <Button
      size={"lg"}
      onClick={handleExecute}
      disabled={executeWorkflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      <span>Execute Workflow</span>
    </Button>
  );
};

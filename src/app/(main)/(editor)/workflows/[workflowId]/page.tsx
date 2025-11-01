import { requireAuth } from "@/modules/auth/lib/auth.utils";

const Page = async ({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) => {
  await requireAuth();

  return <div>{(await params).workflowId}</div>;
};

export default Page;

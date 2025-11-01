import { requireAuth } from "@/modules/auth/lib/auth.utils";

const Page = async ({
  params,
}: {
  params: Promise<{ executionId: string }>;
}) => {
  await requireAuth();

  return <div>{(await params).executionId}</div>;
};

export default Page;

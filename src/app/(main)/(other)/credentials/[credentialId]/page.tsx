import { requireAuth } from "@/modules/auth/lib/auth.utils";

const Page = async ({
  params,
}: {
  params: Promise<{ credentialId: string }>;
}) => {
  await requireAuth();

  return <div>{(await params).credentialId}</div>;
};

export default Page;

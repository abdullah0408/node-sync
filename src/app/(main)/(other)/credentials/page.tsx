import { requireAuth } from "@/modules/auth/lib/auth.utils";

const Page = async () => {
  await requireAuth();
  return <div>Page</div>;
};

export default Page;

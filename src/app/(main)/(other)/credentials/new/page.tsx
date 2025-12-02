import { requireAuth } from "@/modules/auth/lib/auth.utils";
import { CredentialForm } from "@/modules/credentials/components/credential";

const Page = async () => {
  await requireAuth();

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
        <CredentialForm />
      </div>
    </div>
  );
};

export default Page;

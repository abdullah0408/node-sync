import { SignInForm } from "@/modules/auth/components/sign-in-form";
import { requireNoAuth } from "@/modules/auth/lib/auth.utils";

export default async function SignInPage() {
  await requireNoAuth();
  return <SignInForm />;
}

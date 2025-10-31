import { SignUpForm } from "@/modules/auth/components/sign-up-form";
import { requireNoAuth } from "@/modules/auth/lib/auth.utils";

export default async function SignUpPage() {
  await requireNoAuth();
  return <SignUpForm />;
}

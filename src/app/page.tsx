import { requireAuth } from "@/modules/auth/lib/auth.utils";

export default async function Home() {
  await requireAuth();
  return <div>Hello World</div>;
}

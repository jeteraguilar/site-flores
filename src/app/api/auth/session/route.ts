import { getCurrentUser } from "@/lib/server/auth";
import { json, route } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const GET = route(async () => {
  const user = await getCurrentUser();
  return user ? json({ user }) : json({ error: "Sem sessão." }, { status: 401 });
});

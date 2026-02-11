import { getSession } from "@/lib/auth";
import { getUser } from "@/db/service/user";
import { redirect } from "@/i18n/routing";
import ProfilePage from "./ProfilePage";

export default async function Page() {
  const session = await getSession();
  if (!session) {
    return redirect({ href: "/login", locale: "ko" });
  }

  const user = await getUser({ where: { id: session.userId } });

  return (
    <ProfilePage
      initialName={user.name}
      initialEmail={user.email}
      initialOpenAiApiKey={user.openAiApiKey}
    />
  );
}

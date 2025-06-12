import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/settings/SettingsClient";

const SettingsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <SettingsClient session={session} />;
};

export default SettingsPage;
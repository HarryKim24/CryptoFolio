import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/settings/SettingsClient";
import { authOptions } from "@/lib/authOptions";

const SettingsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <SettingsClient session={session} />;
};

export default SettingsPage;
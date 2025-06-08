import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import React from "react";

const SettingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">설정</h1>
      <p>로그인된 사용자: {session.user?.email}</p>
    </div>
  );
};

export default SettingsPage;
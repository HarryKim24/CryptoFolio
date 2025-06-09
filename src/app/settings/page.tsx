import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import React from "react";
import EditButton from "@/components/settings/EditButton";
import { formatDate } from "@/utils/formatDate";

const SettingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-6 py-12">
      <div className="w-full max-w-3xl min-w-[250px] bg-white/5 backdrop-blur-md p-10 sm:p-12 rounded-xl shadow-xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-white">내 정보</h1>
          <EditButton />
        </div>

        <ul className="space-y-4 text-white text-base sm:text-lg">
          <li>
            <span className="font-semibold text-accent">이름:</span> {session.user?.name ?? "-"}
          </li>
          <li>
            <span className="font-semibold text-accent">이메일:</span> {session.user?.email}
          </li>
          <li>
            <span className="font-semibold text-accent">가입일:</span> {formatDate(session.user?.createdAt)}
          </li>
          <li>
            <span className="font-semibold text-accent">최근 수정:</span> {formatDate(session.user?.updatedAt)}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;
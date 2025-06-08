import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import React from "react";

const PortfolioPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">내 포트폴리오</h1>
      <p>환영합니다, {session.user?.email}님!</p>
    </div>
  );
};

export default PortfolioPage;
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import PortfolioClient from "@/components/portfolio/PortfolioClient";
import { getAssets } from "@/lib/portfolioActions";

const PortfolioPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const assets = await getAssets(session.user.id);

  return (
    <PortfolioClient
      initialAssets={assets}
      userId={session.user.id}
    />
  );
};

export default PortfolioPage;
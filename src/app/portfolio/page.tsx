import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import PortfolioClient from "@/components/portfolio/PortfolioClient";

const PortfolioPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <PortfolioClient />;
};

export default PortfolioPage;
import TitleHeader from "../../components/auth/TitleHeader";
import ChildrenWrapper from "../../components/auth/ChildrenWrapper";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-main-gradient px-16 pt-20">
      <div className="flex flex-col items-center w-full max-w-[480px] min-w-[220px]">
        <TitleHeader />
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </div>
    </div>
  );
}
import TitleHeader from "../../components/auth/TitleHeader";
import ChildrenWrapper from "../../components/auth/ChildrenWrapper";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-main-gradient px-4 md:px-16 pt-20">
      <div className="flex flex-col items-center w-full max-w-[480px] min-w-[220px]">
        <TitleHeader />
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </div>
    </main>
  );
};

export default AuthLayout;
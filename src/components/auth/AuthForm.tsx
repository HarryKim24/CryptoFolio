"use client";
import ErrorMessage from "@/components/auth/ErrorMessage";

type Props = {
  onSubmit: (e: React.FormEvent) => void;
  error: string;
  shake: boolean;
  children: React.ReactNode;
};

const AuthForm = ({ onSubmit, error, shake, children }: Props) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <ErrorMessage message={error} shake={shake} />
      {children}
    </form>
  );
};

export default AuthForm;
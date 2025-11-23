import SettingsLayoutClient from "@/components/settings/SettingsLayoutClient";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return <SettingsLayoutClient>{children}</SettingsLayoutClient>;
};

export default SettingsLayout;
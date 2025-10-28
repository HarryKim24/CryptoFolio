import SettingsLayoutClient from "@/components/settings/SettingsLayoutClient";
import React from "react";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SettingsLayoutClient>
      <>{children}</>
    </SettingsLayoutClient>
  );
};

export default SettingsLayout;
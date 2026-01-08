import React from "react";
import { useAuth } from "../context/auth-context";
import SettingsPage from "./SettingsForm";

const Settings: React.FC = () => {
  const { user } = useAuth();
  return <SettingsPage currentUser={user} />;
};

export default Settings;


import { useState } from "react";
import { AuthScreen } from "@/components/AuthScreen";
import { DirectoryViewer } from "@/components/DirectoryViewer";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? (
    <DirectoryViewer onLogout={() => setIsAuthenticated(false)} />
  ) : (
    <AuthScreen onLogin={() => setIsAuthenticated(true)} />
  );
};

export default Index;

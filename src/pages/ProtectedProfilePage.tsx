import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/useAuth";
import ProfilePage from "@/pages/ProfilePage";

export function ProtectedProfilePage() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({ to: "/", replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <ProfilePage onLogout={logout} />;
}

export default ProtectedProfilePage;

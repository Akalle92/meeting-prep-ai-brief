
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { LoadingState } from "@/components/LoadingState";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState message="Checking authentication..." />;
  }

  if (!user) {
    // Redirect to the login page, but save the current location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

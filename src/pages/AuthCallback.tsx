
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/LoadingState";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleOAuthCallback = async () => {
      // Get the URL hash, Supabase automatically handles this to exchange the code for a session
      const { data, error } = await supabase.auth.getSession();
      
      // Redirect to home page or the page they were trying to access
      // Try to get saved redirect path from localStorage or default to home
      const redirectTo = localStorage.getItem('authRedirectPath') || '/';
      localStorage.removeItem('authRedirectPath'); // Clean up
      
      navigate(redirectTo, { replace: true });
    };

    handleOAuthCallback();
  }, [navigate]);

  return <LoadingState message="Completing authentication..." />;
}

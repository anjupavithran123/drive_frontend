// src/pages/OAuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("OAuth session error:", error);
        navigate("/login");
        return;
      }

      // ✅ STORE SUPABASE JWT FOR BACKEND
      localStorage.setItem("token", session.access_token);

      // (optional) store user if you want
      localStorage.setItem("user", JSON.stringify(session.user));

      // ✅ Now dashboard API calls will work
      navigate("/dashboard");
    };

    handleOAuth();
  }, [navigate]);

  return <p>Logging you in...</p>;
}

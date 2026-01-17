import { supabase } from "../lib/supabase";

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${import.meta.env.VITE_FRONTEND_URL}/oauth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) console.error("Google login error:", error.message);
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="
        flex items-center justify-center gap-3
        w-full px-4 py-3
        bg-white text-gray-700
        border border-gray-300
        rounded-xl
        shadow-sm
        hover:bg-gray-50
        hover:shadow-md
        transition
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
    >
      {/* Google Logo */}
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path
          fill="#EA4335"
          d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.4 13.1 17.8 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.1 24.5c0-1.6-.1-2.7-.4-3.9H24v7.4h12.7c-.6 3.1-2.4 5.8-5.1 7.6l7.9 6.1c4.6-4.2 7.6-10.4 7.6-17.2z"
        />
        <path
          fill="#FBBC05"
          d="M10.6 28.3c-.4-1.1-.6-2.3-.6-3.6s.2-2.5.6-3.6l-7.9-6.1C.9 18.4 0 21.1 0 24s.9 5.6 2.7 7.9l7.9-6.1z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.2 0 11.4-2 15.2-5.4l-7.9-6.1c-2.2 1.5-5 2.4-7.3 2.4-6.2 0-11.6-4.2-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"
        />
      </svg>

      <span className="font-medium">
        Continue with Google
      </span>
    </button>
  );
}

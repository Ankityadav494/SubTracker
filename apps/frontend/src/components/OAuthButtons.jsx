import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginWithGoogle, loginWithGithub } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { GOOGLE_CLIENT_ID, GITHUB_CLIENT_ID } from "../utils/constants";

const OAuthButtons = () => {
  const googleRef = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await loginWithGoogle(response.credential);
          setUser(res.user);
          toast.success("Signed in with Google");
          navigate("/");
        } catch {
          toast.error("Google sign-in failed");
        }
      },
    });

    if (googleRef.current) {
      window.google.accounts.id.renderButton(googleRef.current, {
        theme: "outline",
        size: "large",
        width: googleRef.current.offsetWidth || 400,
      });
    }
  }, [navigate, setUser]);

  const handleGithub = () => {
    if (!GITHUB_CLIENT_ID) {
      toast.error("GitHub OAuth not configured");
      return;
    }
    const redirect = `${window.location.origin}/login`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect)}&scope=user:email`;
  };

  if (!GOOGLE_CLIENT_ID && !GITHUB_CLIENT_ID) return null;

  return (
    <div className="flex w-full flex-col gap-2">
      {GOOGLE_CLIENT_ID && (
        <div ref={googleRef} className="flex w-full justify-center [&>div]:w-full [&_iframe]:!w-full" />
      )}
      {GITHUB_CLIENT_ID && (
        <button
          type="button"
          onClick={handleGithub}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-600 bg-stone-800/60 px-4 py-2.5 text-sm font-medium text-stone-200 hover:border-orange-500/50 hover:bg-stone-800"
        >
          Continue with GitHub
        </button>
      )}
    </div>
  );
};

export default OAuthButtons;

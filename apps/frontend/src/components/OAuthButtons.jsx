import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginWithGoogle, loginWithGithub } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { GOOGLE_CLIENT_ID, GITHUB_CLIENT_ID } from "../utils/constants";
import { btnSecondaryClass } from "../utils/styles";

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

    const renderGoogle = () => {
      if (!googleRef.current) return;
      googleRef.current.innerHTML = "";
      const width = Math.min(googleRef.current.offsetWidth || 320, 400);
      window.google.accounts.id.renderButton(googleRef.current, {
        theme: "outline",
        size: "large",
        width,
      });
    };

    renderGoogle();

    const observer = new ResizeObserver(renderGoogle);
    if (googleRef.current) observer.observe(googleRef.current);

    return () => observer.disconnect();
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
    <div className="flex w-full min-w-0 flex-col gap-2">
      {GOOGLE_CLIENT_ID && (
        <div
          ref={googleRef}
          className="flex w-full min-w-0 justify-center overflow-hidden [&>div]:!w-full [&>div]:!max-w-full [&_iframe]:!max-w-full"
        />
      )}
      {GITHUB_CLIENT_ID && (
        <button
          type="button"
          onClick={handleGithub}
          className={`flex w-full min-h-[44px] items-center justify-center gap-2 ${btnSecondaryClass}`}
        >
          Continue with GitHub
        </button>
      )}
    </div>
  );
};

export default OAuthButtons;

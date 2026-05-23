import ChatBot from "./ChatBot";
import PlatformBackground from "./PlatformBackground";

const Layout = ({ children, className = "", showChatBot = true }) => {
  const fixedViewport = /h-svh|h-screen|max-h-svh|min-h-dvh|auth-viewport/.test(className);

  return (
    <div
      className={`relative w-full overflow-x-clip text-slate-800 ${
        fixedViewport ? "auth-viewport min-h-dvh" : "min-h-dvh"
      } ${className}`}
    >
      <PlatformBackground />
      <div
        className={`relative w-full ${
          fixedViewport ? "flex min-h-dvh flex-col" : "min-h-dvh"
        } ${showChatBot && !fixedViewport ? "page-with-chatbot" : ""}`}
      >
        {children}
        {showChatBot && <ChatBot />}
      </div>
    </div>
  );
};

export default Layout;

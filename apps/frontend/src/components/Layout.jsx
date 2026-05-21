import ChatBot from "./ChatBot";

const Layout = ({ children, className = "" }) => {
  const fixedViewport = /h-svh|h-screen|max-h-svh/.test(className);

  return (
  <div
    className={`relative overflow-hidden ${fixedViewport ? "h-svh max-h-svh" : "min-h-svh"} ${className}`}
  >
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-orange-600/20 blur-[100px]" />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-rose-600/15 blur-[90px]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-500/10 blur-[80px]" />
    </div>
    <div
      className={`relative bg-gradient-to-b from-stone-950/50 via-[#0c0a09] to-stone-950 ${
        fixedViewport ? "h-full min-h-0" : "min-h-svh"
      }`}
    >
      {children}
      <ChatBot />
    </div>
  </div>
  );
};

export default Layout;

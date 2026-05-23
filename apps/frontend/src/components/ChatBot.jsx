import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { inputClass } from "../utils/styles";

const BotIcon = ({ className = "h-6 w-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M12 2C7.03 2 3 5.58 3 10c0 2.55 1.35 4.82 3.5 6.32V20l3.86-2.12A10.8 10.8 0 0012 18c4.97 0 9-3.58 9-8s-4.03-8-9-8z"
      fill="currentColor"
      opacity="0.25"
    />
    <circle cx="9" cy="10" r="1.25" fill="currentColor" />
    <circle cx="15" cy="10" r="1.25" fill="currentColor" />
    <path
      d="M9.5 13.2c.94.72 2.06 1.1 3.5 1.1s2.56-.38 3.5-1.1"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M17 3l1.5 2.5L21 5l-2.5 1.5L17 9l-1.5-2.5L13 5l2.5-1.5L17 3z"
      fill="currentColor"
    />
  </svg>
);

const getChatUrl = () => {
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const normalized = base.replace(/\/$/, "");
  return normalized.endsWith("/api")
    ? `${normalized}/chat`
    : `${normalized}/api/chat`;
};

const ChatBot = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!user) {
      toast.error("Log in to chat about your subscriptions");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired — please log in again");
      return;
    }

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const geminiMessages = updated.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const resp = await fetch(getChatUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: geminiMessages }),
      });

      const data = await resp.json();

      if (resp.status === 401) {
        throw new Error("Please log in again to use YaarBot");
      }
      if (!resp.ok) {
        throw new Error(data.error || `Request failed (${resp.status})`);
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        setMessages((prev) => [...prev, { role: "model", content: reply }]);
      } else {
        throw new Error("No response from AI");
      }
    } catch (err) {
      const msg = err.message || "YaarBot error";
      toast.error(msg);
      setMessages((prev) => [...prev, { role: "model", content: `Sorry — ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`fixed z-50 flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 transition-all duration-300 hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-500/40 ${
          open
            ? "bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 h-12 w-12 sm:right-5"
            : "bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 h-14 gap-2 px-3 sm:right-5 sm:gap-2.5 sm:px-5"
        }`}
        aria-label={open ? "Close YaarBot" : "Chat with YaarBot"}
        aria-expanded={open}
      >
        {open ? (
          <span className="text-xl font-light leading-none" aria-hidden>
            ×
          </span>
        ) : (
          <>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30">
              <BotIcon className="h-5 w-5" />
            </span>
            <span className="hidden flex-col items-start text-left leading-tight min-[380px]:flex">
              <span className="text-sm font-bold tracking-tight">YaarBot</span>
              <span className="hidden text-[11px] font-medium text-white/85 sm:inline">
                Chat with YaarBot
              </span>
            </span>
          </>
        )}
      </button>

      {open && (
        <div
          className="fixed left-3 right-3 z-50 flex max-h-[min(70dvh,520px)] flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-2xl shadow-sky-900/10 sm:left-auto sm:right-5 sm:w-96"
          style={{
            bottom: "max(5rem, calc(4.5rem + env(safe-area-inset-bottom, 0px)))",
          }}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-sky-100 bg-sky-50/80 px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white ring-2 ring-sky-200 sm:h-9 sm:w-9">
                <BotIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-sky-700">YaarBot</h3>
                <p className="truncate text-[10px] text-slate-500">Your subscription assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMessages([])}
              className="shrink-0 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-sky-50 hover:text-sky-600"
            >
              Clear
            </button>
          </div>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-3 sm:p-4"
          >
            {messages.length === 0 && (
              <div className="py-4 text-center sm:py-6">
                <p className="text-sm font-medium text-slate-700">Hi! I&apos;m YaarBot</p>
                <p className="mt-1 text-xs text-slate-500">
                  Ask about your spend, renewals, or budget
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] break-words rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap sm:max-w-[85%] sm:px-3.5 sm:py-2.5 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                      : "border border-sky-100 bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-sm text-sky-600">Reading your dashboard...</p>
            )}
          </div>

          <div className="shrink-0 border-t border-sky-100 bg-white p-2.5 sm:p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message YaarBot..."
                disabled={loading}
                className={`${inputClass} min-h-[44px] flex-1 py-2 text-sm`}
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-lg font-bold text-white disabled:opacity-40"
                aria-label="Send message"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

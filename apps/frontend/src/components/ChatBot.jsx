import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

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
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-900/40 transition-all duration-300 hover:scale-[1.03] hover:from-orange-400 hover:to-rose-400 hover:shadow-orange-500/30 ${
          open ? "h-12 w-12 justify-center px-0" : "h-14 max-w-[calc(100vw-2.5rem)] px-4 pr-5 sm:px-5"
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
            <span className="flex flex-col items-start text-left leading-tight">
              <span className="text-sm font-bold tracking-tight">YaarBot</span>
              <span className="text-[11px] font-medium text-white/85">Chat with YaarBot</span>
            </span>
          </>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-stone-700 bg-stone-900 shadow-2xl sm:w-96"
          style={{ maxHeight: "70vh" }}
        >
          <div className="flex items-center justify-between border-b border-stone-800 bg-stone-950/80 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-white ring-2 ring-orange-500/30">
                <BotIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-orange-300">YaarBot</h3>
                <p className="text-[10px] text-stone-500">Your subscription assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMessages([])}
              className="text-xs text-stone-400 hover:text-orange-300"
            >
              Clear
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-stone-950/50 p-4"
            style={{ minHeight: "200px", maxHeight: "50vh" }}
          >
            {messages.length === 0 && (
              <div className="py-6 text-center">
                <p className="text-sm font-medium text-stone-300">Hi! I&apos;m YaarBot</p>
                <p className="mt-1 text-xs text-stone-500">
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
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                      : "border border-stone-700 bg-stone-800 text-stone-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-sm text-orange-400">Reading your dashboard...</p>
            )}
          </div>

          <div className="border-t border-stone-800 bg-stone-950/80 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message YaarBot..."
                disabled={loading}
                className="flex-1 rounded-xl border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 placeholder-stone-500 outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-3 font-bold text-white disabled:opacity-40"
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

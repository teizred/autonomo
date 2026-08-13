"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

type Source = {
  title: string;
  excerpt: string;
};

const SUGGESTIONS = [
  "Quels sont les taux de cotisations sociales en 2026 ?",
  "Comment fonctionne l'ACRE et quel est le délai ?",
  "Quels sont les plafonds de chiffre d'affaires ?",
  "Comment déclarer mon chiffre d'affaires à l'URSSAF ?",
  "Quel est le taux du versement libératoire de l'IR ?",
];

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [openSources, setOpenSources] = useState<Record<string, boolean>>({});

  const isGenerating = status !== "ready";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isGenerating) return;
    sendMessage({ text: suggestion });
  };

  const toggleSources = (id: string) => {
    setOpenSources((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto w-full px-4 sm:px-6">
      {/* Minimal Header */}
      <header className="py-4 border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-semibold text-sm">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-medium text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                Autonomo AI
              </h1>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                2026
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Assistant statut auto-entrepreneur
            </p>
          </div>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <main className="flex-1 overflow-y-auto py-6 space-y-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-2 py-8 max-w-md mx-auto">
            <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              Posez votre question
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Cotisations, démarches URSSAF, ACRE, plafonds de chiffre d'affaires.
            </p>

            <div className="w-full space-y-2 text-left">
              <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">
                Suggestions fréquentes
              </p>
              <div className="flex flex-col gap-1.5">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full text-left text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/50 hover:bg-zinc-100/80 dark:bg-zinc-900/30 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition flex items-center justify-between"
                  >
                    <span>{s}</span>
                    <span className="text-zinc-400 dark:text-zinc-600 text-xs">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === "user";
            const sources = (m.metadata as any)?.sources as Source[] | undefined;
            const isOpen = openSources[m.id] ?? false;

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"} gap-1.5`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-normal"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200/50 dark:border-zinc-800/60"
                  }`}
                >
                  {m.parts?.map((p, i) =>
                    p.type === "text" ? (
                      <div key={i} className="whitespace-pre-wrap">
                        {p.text}
                      </div>
                    ) : null
                  )}
                </div>

                {/* Minimal sources accordion */}
                {!isUser && sources && sources.length > 0 && (
                  <div className="max-w-[85%] sm:max-w-[75%] w-full">
                    <button
                      type="button"
                      onClick={() => toggleSources(m.id)}
                      className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1.5 transition py-1"
                    >
                      <span>
                        {sources.length} source{sources.length > 1 ? "s" : ""}
                      </span>
                      <span className="text-[10px]">{isOpen ? "▲" : "▼"}</span>
                    </button>

                    {isOpen && (
                      <div className="mt-1.5 space-y-1.5 border-l-2 border-zinc-200 dark:border-zinc-800 pl-3 py-1">
                        {sources.map((s, idx) => (
                          <div key={idx} className="text-xs">
                            <p className="font-medium text-zinc-800 dark:text-zinc-200">
                              {s.title}
                            </p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                              {s.excerpt}...
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Minimal loading */}
        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
            Génération en cours...
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Minimal Input Bar */}
      <footer className="py-3 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-white/90 dark:bg-zinc-950/90 backdrop-blur sticky bottom-0">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question..."
            disabled={isGenerating}
            className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 rounded-xl pl-3.5 pr-10 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="absolute right-1.5 p-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-20 transition"
            aria-label="Envoyer"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
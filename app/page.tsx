"use client";

import { useState, FormEvent } from "react";
import WordCard, { WordCardData } from "./components/WordCard";

export default function Home() {
  const [word, setWord] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardData, setCardData] = useState<WordCardData | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = word.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: trimmed,
          context: context.trim() || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Request failed (${res.status})`);
      }

      const data: WordCardData = await res.json();
      setCardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row gap-2">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word"
            className="h-[44px] flex-1 rounded-[10px] px-3.5 text-[15px] outline-none transition-colors"
            style={{
              border: "0.5px solid #D0C9C0",
              color: "#1A1A1A",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#DA7756")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#D0C9C0")}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !word.trim()}
            className="h-[44px] shrink-0 cursor-pointer rounded-[10px] px-5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: "#DA7756" }}
          >
            {loading ? "Generating\u2026" : "Generate"}
          </button>
        </div>

        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Optional: paste the sentence where you found it\u2026"
          className="mt-2 mb-4 h-[38px] w-full rounded-[10px] px-3.5 text-[13px] outline-none transition-colors"
          style={{
            border: "0.5px solid #D0C9C0",
            color: "#1A1A1A",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#DA7756")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#D0C9C0")}
          disabled={loading}
        />
      </form>

      {error && (
        <p className="mb-4 text-[13px]" style={{ color: "#999" }}>
          {error}
        </p>
      )}

      {cardData && <WordCard data={cardData} />}
    </div>
  );
}

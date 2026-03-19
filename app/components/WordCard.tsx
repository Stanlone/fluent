"use client";

import { useState, useCallback } from "react";

interface WordFamily {
  word: string;
  part_of_speech: string;
  is_headline: boolean;
}

interface Pronunciation {
  ipa: string;
  note: string;
}

interface Synonym {
  word: string;
  note_en: string;
  note_ru: string;
}

interface Example {
  text: string;
  source: string;
  date: string | null;
  form: string | null;
}

export interface WordCardData {
  word: string;
  part_of_speech: string;
  register: string;
  level: string;
  word_family: WordFamily[];
  pronunciation: {
    american: Pronunciation;
    british: Pronunciation;
    australian: Pronunciation;
  };
  russian_definition: string;
  english_definition: string;
  synonyms: Synonym[];
  examples: Example[];
  etymology: {
    english: string;
    russian: string;
  };
}

function PronunciationButton({
  label,
  ipa,
  note,
  word,
}: {
  label: string;
  ipa: string;
  note: string;
  word: string;
}) {
  const [speaking, setSpeaking] = useState(false);

  const handlePlay = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [word]);

  return (
    <button
      onClick={handlePlay}
      className="flex cursor-pointer flex-row items-center gap-2 rounded-[10px] border bg-white px-3.5 py-2.5 transition-colors hover:border-[#DA7756] hover:bg-[#FDF6F3]"
      style={{ borderWidth: "0.5px", borderColor: speaking ? "#DA7756" : "#D0C9C0" }}
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
        style={{ backgroundColor: speaking ? "#DA7756" : "#F0EDE8" }}
      >
        <div
          className="ml-0.5 h-0 w-0"
          style={{
            borderLeft: `9px solid ${speaking ? "#fff" : "#888"}`,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
          }}
        />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[13px] font-medium" style={{ color: "#1A1A1A" }}>
          {label}
        </span>
        <span className="mt-px text-[11px]" style={{ color: "#aaa" }}>
          {ipa}
        </span>
        {note && (
          <span className="mt-0.5 text-[11px]" style={{ color: "#DA7756" }}>
            {note}
          </span>
        )}
      </div>
    </button>
  );
}

export default function WordCard({ data }: { data: WordCardData }) {
  return (
    <div
      className="overflow-hidden rounded-[14px] bg-white"
      style={{ border: "0.5px solid #D0C9C0" }}
    >
      {/* HEADER */}
      <div
        className="px-6 pt-5 pb-4"
        style={{ borderBottom: "0.5px solid #E8E3DC" }}
      >
        <h2
          className="font-medium"
          style={{ fontSize: "26px", letterSpacing: "-0.3px", color: "#1A1A1A" }}
        >
          {data.word}
        </h2>

        {/* Meta pills */}
        <div className="mt-2 flex flex-row flex-wrap gap-1.5">
          <span
            className="rounded-[20px] px-2.5 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: "#F0EDE8", color: "#888" }}
          >
            {data.part_of_speech}
          </span>
          <span
            className="rounded-[20px] px-2.5 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: "#F0EDE8", color: "#888" }}
          >
            {data.register}
          </span>
          <span
            className="rounded-[20px] px-2.5 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: "#F7EDE8", color: "#DA7756" }}
          >
            {data.level}
          </span>
        </div>

        {/* Word family */}
        {data.word_family.length > 0 && (
          <div className="mt-3 flex flex-row flex-wrap gap-1.5">
            {data.word_family.map((form) => (
              <div
                key={form.word}
                className="flex min-w-[80px] flex-col items-center rounded-[10px] px-3.5 py-2"
                style={{
                  border: `0.5px solid ${form.is_headline ? "#DA7756" : "#D0C9C0"}`,
                  backgroundColor: form.is_headline ? "#FDF6F3" : "transparent",
                }}
              >
                <span
                  className="text-[13px] font-medium"
                  style={{ color: "#1A1A1A" }}
                >
                  {form.word}
                </span>
                <span
                  className="text-[10px] uppercase"
                  style={{ color: "#aaa", letterSpacing: "0.04em" }}
                >
                  {form.part_of_speech}
                </span>
                {form.is_headline && (
                  <span className="text-[10px]" style={{ color: "#DA7756" }}>
                    headline
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRONUNCIATION */}
      <Section label="Pronunciation" showBorder>
        <div className="flex flex-row flex-wrap gap-2">
          <PronunciationButton
            label="American"
            ipa={data.pronunciation.american.ipa}
            note={data.pronunciation.american.note}
            word={data.word}
          />
          <PronunciationButton
            label="British"
            ipa={data.pronunciation.british.ipa}
            note={data.pronunciation.british.note}
            word={data.word}
          />
          <PronunciationButton
            label="Australian"
            ipa={data.pronunciation.australian.ipa}
            note={data.pronunciation.australian.note}
            word={data.word}
          />
        </div>
      </Section>

      {/* НА РУССКОМ */}
      <Section label="На русском" showBorder>
        <p
          className="text-sm leading-[1.65]"
          style={{ color: "#1A1A1A" }}
        >
          {data.russian_definition}
        </p>
      </Section>

      {/* IN ENGLISH */}
      <Section label="In English" showBorder>
        <p
          className="text-sm leading-[1.65]"
          style={{ color: "#1A1A1A" }}
        >
          {data.english_definition}
        </p>
      </Section>

      {/* IN CONTEXT */}
      <Section label="In context — from your sources" showBorder>
        <div className="flex flex-col">
          {data.examples.map((ex, i) => (
            <div
              key={i}
              className="rounded-r-lg py-2.5 pr-3.5 pl-3.5"
              style={{
                backgroundColor: "#FAF9F7",
                borderLeft: "2px solid #E8E3DC",
                marginBottom: i < data.examples.length - 1 ? "10px" : 0,
              }}
            >
              <p
                className="text-[13px] italic leading-[1.6]"
                style={{ color: "#444" }}
              >
                {ex.text}
              </p>
              <div className="mt-1.5 flex flex-row flex-wrap items-center gap-1.5">
                <span
                  className="rounded px-1.5 py-px text-[10px] not-italic"
                  style={{ backgroundColor: "#F0EDE8", color: "#888" }}
                >
                  {ex.source}
                </span>
                {ex.date && (
                  <span className="text-[11px]" style={{ color: "#bbb" }}>
                    {ex.date}
                  </span>
                )}
                {ex.form && (
                  <span className="text-[11px]" style={{ color: "#bbb" }}>
                    {ex.form}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* SYNONYMS */}
      <Section label="Synonyms — when each fits" showBorder>
        <div className="flex flex-col">
          {data.synonyms.map((syn, i) => (
            <div
              key={syn.word}
              className="flex flex-col gap-0.5"
              style={{
                marginBottom: i < data.synonyms.length - 1 ? "12px" : 0,
              }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: "#1A1A1A" }}
              >
                {syn.word}
              </span>
              <span
                className="text-[13px] leading-[1.5]"
                style={{ color: "#666" }}
              >
                {syn.note_en}
              </span>
              <span
                className="mt-px text-xs leading-[1.5]"
                style={{ color: "#aaa" }}
              >
                {syn.note_ru}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ETYMOLOGY */}
      <Section label="Etymology" showBorder={false}>
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <div
              className="mb-1.5 text-[11px] uppercase"
              style={{ color: "#bbb", letterSpacing: "0.05em" }}
            >
              English
            </div>
            <p className="text-[13px] leading-[1.65]" style={{ color: "#555" }}>
              {data.etymology.english}
            </p>
          </div>
          <div className="flex-1">
            <div
              className="mb-1.5 text-[11px] uppercase"
              style={{ color: "#bbb", letterSpacing: "0.05em" }}
            >
              По-русски
            </div>
            <p className="text-[13px] leading-[1.65]" style={{ color: "#555" }}>
              {data.etymology.russian}
            </p>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <div
        className="flex flex-row gap-2 px-6 py-3.5"
        style={{
          borderTop: "0.5px solid #E8E3DC",
          backgroundColor: "#FAF9F7",
        }}
      >
        <button
          className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-lg text-[13px] transition-colors hover:bg-[#F0EDE8]"
          style={{ border: "0.5px solid #D0C9C0", color: "#555" }}
        >
          Skip
        </button>
        <button
          className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-lg text-[13px] transition-colors hover:bg-[#F0EDE8]"
          style={{ border: "0.5px solid #D0C9C0", color: "#555" }}
        >
          Review later
        </button>
        <button
          className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-lg text-[13px] font-medium text-white transition-colors hover:bg-[#c8664a]"
          style={{ backgroundColor: "#DA7756", border: "0.5px solid #DA7756" }}
        >
          Save to library
        </button>
      </div>
    </div>
  );
}

function Section({
  label,
  showBorder,
  children,
}: {
  label: string;
  showBorder: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="px-6 py-[18px]"
      style={{
        borderBottom: showBorder ? "0.5px solid #E8E3DC" : "none",
      }}
    >
      <div
        className="mb-2.5 text-[11px] font-medium uppercase"
        style={{ color: "#DA7756", letterSpacing: "0.06em" }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

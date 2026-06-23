"use client";

import { useState } from "react";
import type { Phrase } from "@/lib/types";

type DisplayMode = "all" | "hanzi" | "pinyin" | "english";

export default function PhrasePracticeCards({
  phrases,
}: {
  phrases: Phrase[];
}) {
  const [mode, setMode] = useState<DisplayMode>("all");
  const [flippedIds, setFlippedIds] = useState<string[]>([]);

  function toggleFlip(id: string) {
    setFlippedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function resetEverything() {
    setFlippedIds([]);
    setMode("all");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        <button onClick={() => setMode("all")} className={buttonStyle}>
          Show All
        </button>

        <button onClick={() => setMode("hanzi")} className={buttonStyle}>
          Hanzi Only
        </button>

        <button onClick={() => setMode("pinyin")} className={buttonStyle}>
          Pinyin Only
        </button>

        <button onClick={() => setMode("english")} className={buttonStyle}>
          English Only
        </button>

        <button
          onClick={resetEverything}
          className="rounded-full bg-green-600 px-5 py-3 font-bold text-white shadow hover:bg-green-700"
        >
          Reset Everything
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {phrases.map((phrase) => {
          const isFlipped = flippedIds.includes(phrase.id);

          return (
            <button
              key={phrase.id}
              onClick={() => toggleFlip(phrase.id)}
              className="min-h-48 rounded-3xl border-2 border-orange-200 bg-white p-6 text-left shadow-md transition hover:scale-105 hover:border-red-400"
            >
              {isFlipped ? (
                <div>
                  <p className="text-lg font-bold text-red-700">Answer</p>
                  <p className="mt-3 text-3xl font-bold">
                    {phrase.chinese_text}
                  </p>
                  <p className="mt-2 text-xl italic text-gray-600">
                    {phrase.pinyin}
                  </p>
                  <p className="mt-2 text-gray-800">
                    {phrase.english_translation}
                  </p>
                </div>
              ) : (
                <div>
                  {mode === "all" && (
                    <>
                      <p className="text-4xl font-bold text-red-700">
                        {phrase.chinese_text}
                      </p>
                      <p className="mt-2 text-xl italic text-gray-600">
                        {phrase.pinyin}
                      </p>
                      <p className="mt-2 text-gray-800">
                        {phrase.english_translation}
                      </p>
                    </>
                  )}

                  {mode === "hanzi" && (
                    <p className="text-5xl font-bold text-red-700">
                      {phrase.chinese_text}
                    </p>
                  )}

                  {mode === "pinyin" && (
                    <p className="text-3xl italic text-blue-700">
                      {phrase.pinyin}
                    </p>
                  )}

                  {mode === "english" && (
                    <p className="text-2xl font-bold text-gray-800">
                      {phrase.english_translation}
                    </p>
                  )}

                  <p className="mt-6 text-sm font-bold text-gray-400">
                    Click card to flip
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const buttonStyle =
  "rounded-full bg-red-600 px-5 py-3 font-bold text-white shadow hover:bg-red-700";

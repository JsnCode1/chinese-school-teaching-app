"use client";

import { useState } from "react";
import type { Phrase } from "@/lib/types";
import PinyinMatchGamePhrases from "@/components/PinyinMatchGamePhrases";

type DisplayMode = "all" | "hanzi" | "pinyin" | "english";

export default function PhrasePracticeCards({
  phrases,
}: {
  phrases: Phrase[];
}) {
  const [mode, setMode] = useState<DisplayMode>("all");
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [showMatchGame, setShowMatchGame] = useState(false);

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
          <div className="flex flex-col items-center">
            <span>Show All</span>
            <span className="text-xs font-semibold">显示全部</span>
          </div>
        </button>

        <button onClick={() => setMode("hanzi")} className={buttonStyle}>
          <div className="flex flex-col items-center">
            <span>Hanzi Only</span>
            <span className="text-xs font-semibold">仅汉字</span>
          </div>
        </button>

        <button onClick={() => setMode("pinyin")} className={buttonStyle}>
          <div className="flex flex-col items-center">
            <span>Pinyin Only</span>
            <span className="text-xs font-semibold">仅拼音</span>
          </div>
        </button>

        <button onClick={() => setMode("english")} className={buttonStyle}>
          <div className="flex flex-col items-center">
            <span>English Only</span>
            <span className="text-xs font-semibold">仅英语</span>
          </div>
        </button>

        <button
          onClick={resetEverything}
          className="rounded-full bg-green-600 px-5 py-3 font-bold text-white shadow hover:bg-green-700"
        >
          <div className="flex flex-col items-center">
            <span>Reset Everything</span>
            <span className="text-xs font-semibold">重置</span>
          </div>
        </button>

        <button
          onClick={() => setShowMatchGame(true)}
          className="rounded-full bg-yellow-500 px-5 py-3 font-bold text-white shadow hover:bg-yellow-600"
        >
          <div className="flex flex-col items-center">
            <span>Pinyin Match Game</span>
            <span className="text-xs font-semibold">拼音配对</span>
          </div>
        </button>
      </div>

      {showMatchGame ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Pinyin Match Game
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMatchGame(false)}
                className="rounded-full bg-gray-200 px-4 py-2 font-bold"
              >
                Close
              </button>
            </div>
          </div>

          <PinyinMatchGamePhrases phrases={phrases} />
        </div>
      ) : (
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
                    <p className="text-lg font-bold text-red-700">《答案》</p>
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
      )}
    </div>
  );
}

const buttonStyle =
  "rounded-full bg-red-600 px-5 py-3 font-bold text-white shadow hover:bg-red-700";

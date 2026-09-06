"use client";

import { useEffect, useState } from "react";
import type { Phrase } from "@/lib/types";

function shuffleArray<T>(array: T[]) {
  const [...shuffled] = [...array].sort(() => Math.random() - 0.5);
  return [...shuffled].sort(() => Math.random() - 0.5);
}

export default function PinyinMatchGamePhrases({
  phrases,
}: {
  phrases: Phrase[];
}) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<Record<string, "correct" | "wrong">>(
    {},
  );
  const [pinyinBoxes, setPinyinBoxes] = useState<Phrase[]>([]);
  const [hanziCards, setHanziCards] = useState<Phrase[]>([]);
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);

  useEffect(() => {
    setPinyinBoxes(shuffleArray(phrases));
    setHanziCards(shuffleArray(phrases));
  }, [phrases]);

  function checkMatch(phraseId: string, targetId: string) {
    if (!phraseId) return;

    if (phraseId === targetId) {
      setMatches((current) => ({ ...current, [targetId]: phraseId }));

      setFeedback((current) => ({ ...current, [targetId]: "correct" }));

      setMessage("对了！");
    } else {
      setFeedback((current) => ({ ...current, [targetId]: "wrong" }));

      setMessage("再试试！");

      setTimeout(() => {
        setFeedback((current) => {
          const updated = { ...current };
          delete updated[targetId];
          return updated;
        });
      }, 1000);
    }

    setSelectedPhraseId(null);
  }

  function handleDragStart(
    event: React.DragEvent<HTMLButtonElement>,
    phraseId: string,
  ) {
    event.dataTransfer.setData("phraseId", phraseId);
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    pinyinPhraseId: string,
  ) {
    event.preventDefault();

    const draggedPhraseId = event.dataTransfer.getData("phraseId");

    checkMatch(draggedPhraseId, pinyinPhraseId);
  }

  function handleHanziCardClick(phraseId: string) {
    setSelectedPhraseId((current) => (current === phraseId ? null : phraseId));
  }

  function resetGame() {
    setMatches({});
    setMessage("");
    setFeedback({});
    setSelectedPhraseId(null);

    setPinyinBoxes(shuffleArray(phrases));
    setHanziCards(shuffleArray(phrases));
  }

  const matchedPhraseIds = Object.values(matches);
  const score = matchedPhraseIds.length;
  const total = phrases.length;

  return (
    <div className="min-h-[200px]">
      <div className="mb-3 flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Pinyin Match (Phrases)
          </h2>
          <p className="text-sm text-gray-600">
            Match the pinyin to the correct phrase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {message && (
            <span className="rounded-full bg-yellow-100 px-4 py-2 font-bold">
              {message}
            </span>
          )}

          <span className="rounded-full bg-blue-100 px-4 py-2 font-bold text-blue-700">
            {score}/{total}
          </span>

          <button
            onClick={resetGame}
            className="rounded-full bg-red-600 px-4 py-2 font-bold text-white"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-3xl bg-white p-4 shadow">
          <h3 className="mb-3 text-xl font-bold text-gray-900">
            Drop phrases here
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {pinyinBoxes.map((item, index) => {
              const matchedPhraseId = matches[item.id];
              const matchedPhrase = phrases.find(
                (p) => p.id === matchedPhraseId,
              );

              return (
                <div
                  key={item.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, item.id)}
                  onClick={() => {
                    if (selectedPhraseId) {
                      checkMatch(selectedPhraseId, item.id);
                    }
                  }}
                  className={`flex items-center justify-between gap-4 rounded-xl border-2 p-3 transition-all ${
                    feedback[item.id] === "wrong"
                      ? "border-red-500 bg-red-100"
                      : feedback[item.id] === "correct"
                        ? "border-green-500 bg-green-100"
                        : matchedPhrase
                          ? "border-green-300 bg-green-50"
                          : "border-dashed border-blue-200 bg-orange-50 hover:border-blue-400"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-700">
                        {index + 1}
                      </span>
                      <span className="text-xl font-extrabold text-gray-900">
                        {item.pinyin ?? ""}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Tap a phrase, then tap a pinyin to match.
                    </div>
                  </div>

                  <div className="min-w-[160px] flex items-center justify-center rounded-md bg-white p-2">
                    {matchedPhrase ? (
                      <div className="text-lg font-bold text-red-600">
                        {matchedPhrase.chinese_text}
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-gray-400">
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-4 shadow">
          <h3 className="mb-3 text-xl font-bold text-red-700">Tap phrases</h3>

          <div className="grid grid-cols-1 gap-3">
            {hanziCards.map((item) => {
              const alreadyMatched = matchedPhraseIds.includes(item.id);
              const isSelected = selectedPhraseId === item.id;

              if (alreadyMatched) return null;

              return (
                <button
                  key={item.id}
                  draggable
                  onDragStart={(event) => handleDragStart(event, item.id)}
                  onClick={() => handleHanziCardClick(item.id)}
                  className={`w-full text-left cursor-grab rounded-2xl border-2 p-3 text-base font-extrabold shadow transition hover:bg-white ${
                    isSelected
                      ? "border-blue-500 bg-blue-100 text-blue-700"
                      : "border-red-100 bg-red-50 text-red-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg">{item.chinese_text}</div>
                    <div className="text-sm italic text-gray-500">
                      {item.english_translation ?? ""}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

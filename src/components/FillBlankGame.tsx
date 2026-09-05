"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  sentence: string;
  removeCount?: number;
  pinyin?: string | null;
};

const PUNCT = new Set([
  "，",
  "。",
  "！",
  "？",
  "；",
  "：",
  "、",
  ",",
  ".",
  "!",
  "?",
  ";",
  ":",
  "…",
  " ",
  "（",
  "）",
  "(",
  ")",
  "“",
  "”",
  "\n",
]);

function normalizePinyin(input: string | null | undefined) {
  return (
    input
      ?.split(/\s+/)
      .map((token) => token.replace(/[，。！？；：、,.!?;:…]/g, "").trim())
      .filter(Boolean) ?? []
  );
}

function pickIndices(length: number, count: number) {
  const indices = new Set<number>();

  while (indices.size < Math.min(count, length)) {
    indices.add(Math.floor(Math.random() * length));
  }

  return Array.from(indices).sort((a, b) => a - b);
}

export default function FillBlankGame({
  sentence,
  removeCount,
  pinyin,
}: Props) {
  const chars = useMemo(() => Array.from(sentence), [sentence]);

  const [showPinyin, setShowPinyin] = useState(false);
  const [seed, setSeed] = useState(0);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [available, setAvailable] = useState<{ id: string; char: string }[]>(
    [],
  );

  const [feedback, setFeedback] = useState<{
    type: "success" | "warning";
    message: string;
  } | null>(null);

  const pinyinWords = useMemo(() => normalizePinyin(pinyin), [pinyin]);

  const candidateIndices = useMemo(() => {
    return chars
      .map((char, index) => ({ char, index }))
      .filter(({ char }) => !PUNCT.has(char))
      .map(({ index }) => index);
  }, [chars]);

  const { blanks, tiles, blankIndices } = useMemo(() => {
    const availableCount = candidateIndices.length;

    let effectiveRemoveCount: number;

    if (typeof removeCount === "number") {
      effectiveRemoveCount = Math.min(removeCount, availableCount);
    } else if (availableCount <= 0) {
      effectiveRemoveCount = 0;
    } else {
      const minCount = Math.min(2, availableCount);

      const maxCount = Math.min(
        4,
        Math.max(minCount, Math.floor(availableCount * 0.6)),
      );

      if (maxCount <= minCount) {
        effectiveRemoveCount = maxCount;
      } else {
        const pseudo = ((seed * 9301 + 49297) % 233280) / 233280;

        effectiveRemoveCount =
          Math.floor(pseudo * (maxCount - minCount + 1)) + minCount;
      }
    }

    const toRemove = pickIndices(
      candidateIndices.length,
      effectiveRemoveCount,
    ).map((index) => candidateIndices[index]);

    const blankSet = new Set(toRemove);

    const blanks = chars.map((char, index) =>
      blankSet.has(index) ? "" : char,
    );

    const shuffled = [...toRemove];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const tiles = shuffled.map((index, tileIndex) => ({
      id: `${index}-${seed}-${tileIndex}`,
      char: chars[index],
    }));

    return {
      blanks,
      tiles,
      blankIndices: toRemove,
    };
  }, [chars, candidateIndices, removeCount, seed]);

  const charPinyin = useMemo(() => {
    const map: string[] = [];
    let pinyinIndex = 0;

    for (const char of chars) {
      if (PUNCT.has(char)) {
        map.push("");
      } else {
        map.push(pinyinWords[pinyinIndex++] ?? "");
      }
    }

    return map;
  }, [chars, pinyinWords]);

  useEffect(() => {
    setPlaced({});
    setAvailable(tiles);
    setSelectedTile(null);
    setFeedback(null);
  }, [tiles]);

  const completedCount = Object.keys(placed).length;
  const totalBlanks = blankIndices.length;

  const progress =
    totalBlanks > 0 ? Math.round((completedCount / totalBlanks) * 100) : 0;

  function handleDrop(blankIndex: number, tileId: string) {
    const tile = available.find((item) => item.id === tileId);

    if (!tile) return;

    // If this blank already contains something, return it first.
    const existingChar = placed[blankIndex];

    if (existingChar) {
      setAvailable((current) => [
        ...current,
        {
          id: `${blankIndex}-returned-${Date.now()}`,
          char: existingChar,
        },
      ]);
    }

    setPlaced((current) => ({
      ...current,
      [blankIndex]: tile.char,
    }));

    setAvailable((current) => current.filter((item) => item.id !== tileId));

    setSelectedTile(null);
    setFeedback(null);
  }

  function handleRemoveFromBlank(blankIndex: number) {
    const char = placed[blankIndex];

    if (!char) return;

    setAvailable((current) => [
      ...current,
      {
        id: `${blankIndex}-returned-${Date.now()}`,
        char,
      },
    ]);

    setPlaced((current) => {
      const copy = { ...current };
      delete copy[blankIndex];
      return copy;
    });

    setFeedback(null);
  }

  function checkAnswers() {
    if (completedCount < totalBlanks) {
      setFeedback({
        type: "warning",
        message: `Keep going! You still have ${
          totalBlanks - completedCount
        } blank${totalBlanks - completedCount === 1 ? "" : "s"} to fill.`,
      });

      return;
    }

    const wrong = blankIndices.filter(
      (index) => placed[index] !== chars[index],
    );

    if (wrong.length === 0) {
      setFeedback({
        type: "success",
        message: "太棒了！Perfect! You completed the sentence correctly 🎉",
      });

      return;
    }

    const correct = totalBlanks - wrong.length;

    setFeedback({
      type: "warning",
      message: `${correct}/${totalBlanks} correct. Have another try — you're close!`,
    });
  }

  function resetGame() {
    setSeed((current) => current + 1);
  }

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-orange-50 shadow-lg">
      {/* Header */}
      <div className="border-b border-purple-100 bg-white/70 px-5 py-5 backdrop-blur-sm sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-xl text-white shadow-sm">
                ✍️
              </span>

              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Fill in the Sentence
                </h3>

                <p className="text-xs font-medium text-gray-500">
                  填空游戏 · Complete the missing characters
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowPinyin((current) => !current)}
              className={`rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition-all duration-200 ${
                showPinyin
                  ? "border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200"
                  : "border-gray-200 bg-white text-gray-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
              }`}
            >
              {showPinyin ? "拼音 ✓" : "Show Pinyin"}
            </button>

            <button
              type="button"
              onClick={resetGame}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
            >
              ↻ New Game
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-bold">
            <span className="text-gray-500">Progress</span>

            <span className="text-purple-600">
              {completedCount}/{totalBlanks} filled
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-purple-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Sentence */}
        <div className="relative mb-7 overflow-hidden rounded-3xl border border-orange-100 bg-white px-4 py-7 shadow-sm sm:px-6">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-100/60 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-purple-100/60 blur-2xl" />

          <p className="relative mb-5 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-orange-400">
            Complete the sentence
          </p>

          <div className="relative flex flex-wrap items-end justify-center gap-x-1 gap-y-4 text-center">
            {chars.map((char, index) => {
              const py = charPinyin[index] ?? "";
              const isBlank = blanks[index] === "";
              const placedChar = placed[index];

              if (isBlank) {
                const isCorrect = placedChar && placedChar === chars[index];

                const isIncorrect =
                  placedChar && feedback && placedChar !== chars[index];

                return (
                  <span
                    key={index}
                    className="inline-flex min-w-[44px] flex-col items-center"
                  >
                    {/* Pinyin */}
                    <span className="mb-1 h-4 text-xs font-bold text-red-500">
                      {showPinyin ? py : ""}
                    </span>

                    {/* Blank */}
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedTile) {
                          handleDrop(index, selectedTile);
                        }
                      }}
                      onDoubleClick={() => handleRemoveFromBlank(index)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        const id = event.dataTransfer.getData("text/plain");

                        if (id) {
                          handleDrop(index, id);
                        }
                      }}
                      title={
                        placedChar
                          ? "Double-click to remove"
                          : "Place a character here"
                      }
                      className={`group flex h-14 w-11 items-center justify-center rounded-xl border-2 text-3xl font-extrabold transition-all duration-200 ${
                        isIncorrect
                          ? "border-red-300 bg-red-50 text-red-600 shadow-sm"
                          : isCorrect && feedback
                            ? "border-green-300 bg-green-50 text-green-700 shadow-sm"
                            : placedChar
                              ? "border-purple-300 bg-purple-50 text-gray-900 shadow-sm hover:border-purple-400"
                              : selectedTile
                                ? "animate-pulse border-purple-400 bg-purple-50 text-gray-900 shadow-md hover:scale-105 hover:bg-purple-100"
                                : "border-dashed border-gray-300 bg-gray-50 text-gray-900 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      {placedChar || (
                        <span className="text-xl font-bold text-gray-300 transition group-hover:text-purple-300">
                          ?
                        </span>
                      )}
                    </button>
                  </span>
                );
              }

              // Punctuation doesn't need fixed character-box styling.
              if (PUNCT.has(char)) {
                return (
                  <span
                    key={index}
                    className="inline-flex flex-col items-center justify-end"
                  >
                    <span className="mb-1 h-4 text-xs">&nbsp;</span>

                    <span className="flex h-14 items-center justify-center text-3xl font-bold text-gray-800">
                      {char}
                    </span>
                  </span>
                );
              }

              return (
                <span
                  key={index}
                  className="inline-flex min-w-[44px] flex-col items-center"
                >
                  <span className="mb-1 h-4 text-xs font-bold text-red-500">
                    {showPinyin ? py : ""}
                  </span>

                  <span className="flex h-14 w-11 items-center justify-center text-3xl font-extrabold text-gray-900">
                    {char}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Character bank */}
        <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50/60 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-extrabold text-gray-900">Character Bank</h4>

              <p className="text-xs text-gray-500">
                汉字选择 · Choose the missing character
              </p>
            </div>

            {selectedTile && (
              <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                Character selected ✓
              </span>
            )}
          </div>

          <div className="flex min-h-[72px] flex-wrap items-center justify-center gap-3">
            {available.length > 0 ? (
              available.map((tile) => {
                const selected = selectedTile === tile.id;

                return (
                  <button
                    type="button"
                    key={tile.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", tile.id);

                      event.dataTransfer.effectAllowed = "move";
                    }}
                    onClick={() => {
                      setSelectedTile((current) =>
                        current === tile.id ? null : tile.id,
                      );
                    }}
                    className={`relative flex h-16 w-16 select-none items-center justify-center rounded-2xl border-2 text-3xl font-extrabold shadow-sm transition-all duration-200 ${
                      selected
                        ? "-translate-y-1 scale-105 border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-200 ring-4 ring-purple-100"
                        : "border-white bg-white text-gray-900 hover:-translate-y-1 hover:border-purple-200 hover:bg-purple-50 hover:shadow-md"
                    }`}
                  >
                    {tile.char}

                    {selected && (
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white shadow">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="flex items-center gap-2 py-2 text-sm font-semibold text-green-700">
                <span className="text-xl">✨</span>
                All characters have been placed!
              </div>
            )}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mt-5 rounded-2xl border px-4 py-4 text-center text-sm font-bold ${
              feedback.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            <span className="mr-2">
              {feedback.type === "success" ? "🎉" : "🌱"}
            </span>

            {feedback.message}
          </div>
        )}

        {/* Check answer button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={checkAnswers}
            className="group rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          >
            <span className="flex items-center gap-2">
              Check My Answer
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

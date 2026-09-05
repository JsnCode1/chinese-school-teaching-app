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
  const chars = Array.from(sentence);

  function normalizePinyin(input: string | null | undefined) {
    return (
      input
        ?.split(/\s+/)
        .map((token) => token.replace(/[，。！？；：、,.!?;:…]/g, "").trim())
        .filter(Boolean) ?? []
    );
  }

  const [showPinyin, setShowPinyin] = useState(false);
  const pinyinWords = normalizePinyin(pinyin ?? "");

  const candidateIndices = useMemo(() => {
    return chars
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => !PUNCT.has(c))
      .map(({ i }) => i);
  }, [sentence]);

  const [seed, setSeed] = useState(0);

  const { blanks, tiles } = useMemo(() => {
    const available = candidateIndices.length;

    let effectiveRemoveCount: number;
    if (typeof removeCount === "number") {
      effectiveRemoveCount = Math.min(removeCount, available);
    } else {
      if (available <= 0) {
        effectiveRemoveCount = 0;
      } else {
        const minCount = Math.min(2, available);
        const max = Math.min(
          4,
          Math.max(minCount, Math.floor(available * 0.6)),
        );
        if (max <= minCount) {
          effectiveRemoveCount = max;
        } else {
          const pseudo = ((seed * 9301 + 49297) % 233280) / 233280;
          const rand = Math.floor(pseudo * (max - minCount + 1)) + minCount; // minCount..max
          effectiveRemoveCount = Math.min(rand, available);
        }
      }
    }

    const toRemove = pickIndices(
      candidateIndices.length,
      effectiveRemoveCount,
    ).map((k) => candidateIndices[k]);

    const blankSet = new Set(toRemove);

    const blanks = chars.map((c, i) => (blankSet.has(i) ? "" : c));

    const shuffled = [...toRemove];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const tiles = shuffled.map((i, idx) => ({
      id: `${i}-${seed}-${idx}`,
      char: chars[i],
    }));

    return { blanks, tiles };
  }, [sentence, removeCount, seed, candidateIndices]);

  // build per-character pinyin mapping for display
  const charPinyin = useMemo(() => {
    const words = pinyinWords;
    const map: string[] = [];
    let idx = 0;
    for (const c of chars) {
      if (PUNCT.has(c)) {
        map.push("");
      } else {
        map.push(words[idx++] ?? "");
      }
    }
    return map;
  }, [chars, pinyinWords]);

  const [placed, setPlaced] = useState<Record<string | number, string>>({});
  const [available, setAvailable] = useState(tiles);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  useEffect(() => {
    setPlaced({});
    setAvailable(tiles);
    setSelectedTile(null);
  }, [seed, tiles]);

  function handleDrop(blankIndex: number, tileId: string) {
    const tile = available.find((t) => t.id === tileId);
    if (!tile) return;
    setPlaced((p) => ({ ...p, [blankIndex]: tile.char }));
    setAvailable((a) => a.filter((t) => t.id !== tileId));
    setSelectedTile(null);
  }

  function handleRemoveFromBlank(blankIndex: number) {
    const char = placed[blankIndex];
    if (!char) return;
    const id = `${blankIndex}-returned-${Date.now()}`;
    setAvailable((a) => [...a, { id, char }]);
    setPlaced((p) => {
      const copy = { ...p };
      delete copy[blankIndex];
      return copy;
    });
  }

  function checkAnswers() {
    const errors = Object.entries(placed).filter(([k, v]) => {
      const idx = Number(k);
      return v !== chars[idx];
    });
    return { total: Object.keys(placed).length, wrong: errors.length };
  }

  return (
    <div className="mt-4 rounded-2xl border p-4 bg-white shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Drag or click-to-place the characters
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowPinyin((s) => !s)}
            className={`rounded-full px-3 py-1 text-sm border ${showPinyin ? "bg-yellow-50 text-yellow-800 border-yellow-200" : "bg-white text-gray-700 border-gray-200"}`}
          >
            {showPinyin ? "Hide pinyin" : "Show pinyin"}
          </button>

          <button
            onClick={() => setSeed((s) => s + 1)}
            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm"
          >
            Reset
          </button>
          <button
            onClick={() => {
              const result = checkAnswers();
              alert(`${result.total - result.wrong}/${result.total} correct`);
            }}
            className="rounded-full bg-indigo-600 px-3 py-1 text-sm font-bold text-white"
          >
            Check
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-center text-2xl leading-relaxed">
          {chars.map((ch, i) => {
            const py = charPinyin[i] ?? "";
            if (blanks[i] === "") {
              const placedChar = placed[i];
              return (
                <span key={i} className="inline-block w-9 mx-0.5 align-middle">
                  <div className="text-xs font-medium leading-none text-red-600 h-4">
                    {showPinyin ? py : ""}
                  </div>
                  <div
                    onClick={() => {
                      if (selectedTile) {
                        handleDrop(i, selectedTile);
                      }
                    }}
                    onDoubleClick={() => handleRemoveFromBlank(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const id = e.dataTransfer.getData("text/plain");
                      if (id) handleDrop(i, id);
                    }}
                    className="w-9 h-11 flex items-center justify-center cursor-pointer rounded border border-dashed border-gray-300 bg-gray-50 text-center text-3xl leading-10"
                  >
                    {placedChar ?? ""}
                  </div>
                </span>
              );
            }

            return (
              <span key={i} className="inline-block w-9 mx-0.5 align-middle">
                <div className="text-xs font-medium leading-none text-red-600 h-4">
                  {showPinyin ? py : ""}
                </div>
                <div className="w-9 h-11 flex items-center justify-center text-3xl font-bold">
                  {ch}
                </div>
              </span>
            );
          })}
        </div>
      </div>

      <div className="mb-2">
        <p className="mb-2 text-sm text-gray-600">Tiles</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {available.map((t) => (
            <div
              key={t.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", t.id);
              }}
              onClick={() => {
                setSelectedTile((s) => (s === t.id ? null : t.id));
              }}
              className={`select-none cursor-pointer rounded border px-3 py-2 text-2xl ${selectedTile === t.id ? "bg-yellow-200" : "bg-white"}`}
            >
              {t.char}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

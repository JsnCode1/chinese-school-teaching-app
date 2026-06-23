"use client";

import { useEffect, useState } from "react";
import type { CharacterItem } from "@/lib/types";

function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function PinyinMatchGame({
  characters,
}: {
  characters: CharacterItem[];
}) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<Record<string, "correct" | "wrong">>(
    {},
  );
  const [pinyinBoxes, setPinyinBoxes] = useState<CharacterItem[]>([]);
  const [hanziCards, setHanziCards] = useState<CharacterItem[]>([]);

  useEffect(() => {
    setPinyinBoxes(shuffleArray(characters));
    setHanziCards(shuffleArray(characters));
  }, [characters]);

  function handleDragStart(
    event: React.DragEvent<HTMLButtonElement>,
    characterId: string,
  ) {
    event.dataTransfer.setData("characterId", characterId);
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    pinyinCharacterId: string,
  ) {
    event.preventDefault();

    const draggedCharacterId = event.dataTransfer.getData("characterId");

    if (!draggedCharacterId) return;

    if (draggedCharacterId === pinyinCharacterId) {
      setMatches((current) => ({
        ...current,
        [pinyinCharacterId]: draggedCharacterId,
      }));

      setFeedback((current) => ({
        ...current,
        [pinyinCharacterId]: "correct",
      }));

      setMessage("对了！");
    } else {
      setFeedback((current) => ({
        ...current,
        [pinyinCharacterId]: "wrong",
      }));

      setMessage("在试试！");

      setTimeout(() => {
        setFeedback((current) => {
          const updated = { ...current };
          delete updated[pinyinCharacterId];
          return updated;
        });
      }, 1000);
    }
  }

  function resetGame() {
    setMatches({});
    setMessage("");
    setFeedback({});

    setPinyinBoxes(shuffleArray(characters));
    setHanziCards(shuffleArray(characters));
  }

  const matchedCharacterIds = Object.values(matches);
  const score = matchedCharacterIds.length;
  const total = characters.length;

  return (
    <div className="h-[calc(100vh-180px)] overflow-hidden">
      <div className="mb-3 flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Pinyin Match Game
          </h2>
          <p className="text-sm text-gray-600">
            Drag each character to the correct pinyin.
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

      <div className="grid h-[calc(100%-90px)] grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="overflow-hidden rounded-3xl bg-white p-4 shadow">
          <h3 className="mb-3 text-xl font-bold text-gray-900">
            Drop characters here
          </h3>

          <div className="grid h-[calc(100%-40px)] grid-cols-3 gap-3">
            {pinyinBoxes.map((item) => {
              const matchedCharacterId = matches[item.id];
              const matchedCharacter = characters.find(
                (char) => char.id === matchedCharacterId,
              );

              return (
                <div
                  key={item.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, item.id)}
                  className={`rounded-2xl border-2 p-2 text-center transition-all duration-300 ${
                    feedback[item.id] === "wrong"
                      ? "border-red-500 bg-red-100"
                      : feedback[item.id] === "correct"
                        ? "border-green-500 bg-green-100"
                        : matchedCharacter
                          ? "border-green-300 bg-green-50"
                          : "border-dashed border-blue-200 bg-orange-50"
                  }`}
                >
                  <p className="text-xl font-extrabold text-gray-900">
                    {item.pinyin}
                  </p>

                  <div className="mt-1 flex h-16 items-center justify-center rounded-xl bg-white">
                    {matchedCharacter ? (
                      <span className="text-4xl font-extrabold text-red-600">
                        {matchedCharacter.character}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400">
                        Drop here
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white p-4 shadow">
          <h3 className="mb-3 text-xl font-bold text-red-700">
            Drag characters
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {hanziCards.map((item) => {
              const alreadyMatched = matchedCharacterIds.includes(item.id);
              if (alreadyMatched) return null;

              return (
                <button
                  key={item.id}
                  draggable
                  onDragStart={(event) => handleDragStart(event, item.id)}
                  className="cursor-grab rounded-2xl border-2 border-red-100 bg-red-50 p-3 text-4xl font-extrabold text-red-600 shadow hover:bg-white"
                >
                  {item.character}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

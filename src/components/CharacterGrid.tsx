"use client";

import { useState } from "react";
import CharacterPopup from "@/components/CharacterPopup";
import type { CharacterItem } from "@/lib/types";

export default function CharacterGrid({
  characters,
}: {
  characters: CharacterItem[];
}) {
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
        {characters.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedCharacter(item)}
            className="rounded-3xl bg-white p-8 shadow transition hover:scale-105 hover:shadow-xl"
          >
            <div className="text-6xl font-bold text-red-600">
              {item.character}
            </div>

            <p className="mt-3 text-xl italic text-gray-600">{item.pinyin}</p>
            <p className="mt-2 text-gray-700">{item.meaning}</p>
          </button>
        ))}
      </div>

      {selectedCharacter && (
        <CharacterPopup
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </>
  );
}

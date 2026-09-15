"use client";

import { useEffect, useState } from "react";
import type { CharacterItem } from "@/lib/types";

const alphabeticalKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const qwertyRows = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split(""),
];
const maxMistakes = 6;

function normalizePinyin(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

function getPinyinLetters(value: string) {
  return Array.from(value).filter(
    (letter) => letter.toUpperCase() !== letter.toLowerCase(),
  );
}

function HangmanDrawing({ mistakes }: { mistakes: number }) {
  return (
    <div className="mx-auto mb-6 max-w-xs rounded-3xl border-2 border-orange-200 bg-white p-3">
      <svg
        viewBox="0 0 240 240"
        role="img"
        aria-label={`${mistakes} of ${maxMistakes} hangman mistakes`}
        className="h-auto w-full"
      >
        <line
          x1="28"
          y1="220"
          x2="208"
          y2="220"
          stroke="#374151"
          strokeWidth="6"
        />
        <line
          x1="64"
          y1="220"
          x2="64"
          y2="24"
          stroke="#374151"
          strokeWidth="6"
        />
        <line
          x1="64"
          y1="24"
          x2="164"
          y2="24"
          stroke="#374151"
          strokeWidth="6"
        />
        <line
          x1="164"
          y1="24"
          x2="164"
          y2="52"
          stroke="#374151"
          strokeWidth="5"
        />

        {mistakes >= 1 && (
          <circle
            cx="164"
            cy="76"
            r="24"
            fill="#fff7ed"
            stroke="#dc2626"
            strokeWidth="5"
            className="hangman-head"
          />
        )}
        {mistakes >= 2 && (
          <line
            x1="164"
            y1="100"
            x2="164"
            y2="158"
            stroke="#dc2626"
            strokeWidth="5"
            className="hangman-draw"
          />
        )}
        {mistakes >= 3 && (
          <line
            x1="164"
            y1="116"
            x2="132"
            y2="140"
            stroke="#dc2626"
            strokeWidth="5"
            className="hangman-draw"
          />
        )}
        {mistakes >= 4 && (
          <line
            x1="164"
            y1="116"
            x2="196"
            y2="140"
            stroke="#dc2626"
            strokeWidth="5"
            className="hangman-draw"
          />
        )}
        {mistakes >= 5 && (
          <line
            x1="164"
            y1="158"
            x2="136"
            y2="194"
            stroke="#dc2626"
            strokeWidth="5"
            className="hangman-draw"
          />
        )}
        {mistakes >= 6 && (
          <line
            x1="164"
            y1="158"
            x2="192"
            y2="194"
            stroke="#dc2626"
            strokeWidth="5"
            className="hangman-draw"
          />
        )}
      </svg>
      <p className="text-center text-sm font-bold text-gray-500">
        Hangman: {mistakes}/{maxMistakes}
      </p>
    </div>
  );
}

export default function HangmanGame({
  characters,
}: {
  characters: CharacterItem[];
}) {
  const [characterIndex, setCharacterIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [keyboardLayout, setKeyboardLayout] = useState<
    "alphabetical" | "qwerty"
  >("alphabetical");

  const current = characters[characterIndex];
  const displayLetters = current ? getPinyinLetters(current.pinyin) : [];
  const answer = displayLetters
    .map((letter) => normalizePinyin(letter))
    .join("");
  const wrongGuesses = guessedLetters.filter(
    (letter) => !answer.includes(letter),
  );
  const isComplete =
    answer.length > 0 &&
    [...new Set(answer)].every((letter) => guessedLetters.includes(letter));
  const isLost = wrongGuesses.length >= maxMistakes;
  const gameOver = isComplete || isLost;
  const keyboardRows =
    keyboardLayout === "qwerty" ? qwertyRows : [alphabeticalKeys];

  useEffect(() => {
    setGuessedLetters([]);
  }, [characterIndex]);

  function guessLetter(letter: string) {
    if (gameOver || guessedLetters.includes(letter)) return;

    setGuessedLetters((currentGuesses) => [...currentGuesses, letter]);
  }

  function selectCharacter(selectedIndex: number) {
    setCharacterIndex(selectedIndex);
    setPickerOpen(false);
  }

  function nextCharacter() {
    if (characters.length < 2) {
      setGuessedLetters([]);
      return;
    }

    setCharacterIndex((currentIndex) => (currentIndex + 1) % characters.length);
  }

  function revealHint() {
    if (gameOver) return;

    const hiddenLetter = displayLetters.find((letter) => {
      const normalizedLetter = normalizePinyin(letter);
      return !guessedLetters.includes(normalizedLetter);
    });

    if (hiddenLetter) {
      setGuessedLetters((currentGuesses) => [
        ...currentGuesses,
        normalizePinyin(hiddenLetter),
      ]);
    }
  }

  function resetRound() {
    setGuessedLetters([]);
  }

  if (!current) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800">
          No characters available
        </h2>
        <p className="mt-3 text-gray-600">
          Add characters to this lesson to play Hangman.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl rounded-3xl bg-white p-5 shadow-lg sm:p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Pinyin Hangman 猜拼音
          </h2>
          <p className="mt-2 text-gray-600">
            Guess the pinyin from the meaning and reveal the character.
          </p>
        </div>

        <div className="rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">
          Mistakes: {wrongGuesses.length}/{maxMistakes}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <section className="rounded-3xl bg-orange-50 p-6 text-center">
          <HangmanDrawing mistakes={wrongGuesses.length} />

          <div className="text-sm font-bold uppercase tracking-wide text-red-500">
            Meaning / 意思
          </div>
          <div className="mt-3 text-3xl font-extrabold text-gray-900">
            {current.meaning}
          </div>
          <div className="mt-8 text-8xl font-black text-red-600">
            {gameOver ? current.character : "?"}
          </div>
          <div className="mt-4 text-gray-600">
            Character {characterIndex + 1} of {characters.length}
          </div>
        </section>

        <section className="rounded-3xl border-2 border-blue-100 bg-blue-50 p-6">
          <div className="mb-8 flex min-h-16 flex-wrap items-center justify-center gap-3">
            {displayLetters.map((displayLetter, letterIndex) => {
              const normalizedLetter = normalizePinyin(displayLetter);

              return (
                <span
                  key={`${displayLetter}-${letterIndex}`}
                  className="flex h-12 w-10 items-center justify-center border-b-4 border-blue-500 text-2xl font-black text-gray-900"
                >
                  {guessedLetters.includes(normalizedLetter) || isLost
                    ? displayLetter
                    : "_"}
                </span>
              );
            })}
          </div>

          {isComplete && (
            <p className="mb-5 rounded-2xl bg-green-100 p-4 text-center font-bold text-green-800">
              Correct! Great pinyin.
            </p>
          )}

          {isLost && (
            <p className="mb-5 rounded-2xl bg-red-100 p-4 text-center font-bold text-red-800">
              The answer was {current.pinyin}. Try the next one.
            </p>
          )}

          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-sm font-bold text-gray-600">
              Keyboard:
            </span>
            {(["alphabetical", "qwerty"] as const).map((layout) => (
              <button
                key={layout}
                type="button"
                onClick={() => setKeyboardLayout(layout)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  keyboardLayout === layout
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 shadow-sm hover:bg-yellow-100"
                }`}
              >
                {layout === "alphabetical" ? "A-Z" : "QWERTY"}
              </button>
            ))}
          </div>

          <div
            className={
              keyboardLayout === "alphabetical"
                ? "grid grid-cols-7 gap-2 sm:grid-cols-9"
                : "space-y-2"
            }
          >
            {keyboardRows.map((row, rowIndex) => (
              <div
                key={`${keyboardLayout}-${rowIndex}`}
                className={
                  keyboardLayout === "qwerty"
                    ? "flex justify-center gap-1.5 sm:gap-2"
                    : "contents"
                }
              >
                {row.map((letter) => {
                  const isGuessed = guessedLetters.includes(letter);
                  const isCorrect = answer.includes(letter);

                  return (
                    <button
                      key={letter}
                      type="button"
                      disabled={gameOver || isGuessed}
                      onClick={() => guessLetter(letter)}
                      className={`h-11 min-w-8 rounded-xl px-2 font-bold transition sm:h-12 sm:min-w-10 ${
                        isGuessed
                          ? isCorrect
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                          : "bg-white text-gray-800 shadow-sm hover:bg-yellow-100"
                      } disabled:cursor-not-allowed disabled:opacity-80`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              disabled={gameOver}
              onClick={revealHint}
              className="rounded-full bg-yellow-500 px-5 py-3 font-bold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hint / 提示
            </button>
            <button
              type="button"
              onClick={resetRound}
              className="rounded-full bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Reset Round
            </button>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="rounded-full bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Pick Character / 选汉字
            </button>
            <button
              type="button"
              onClick={nextCharacter}
              className="rounded-full bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
            >
              Next Character / 下一个
            </button>
          </div>
        </section>
      </div>

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-red-700">
                Pick a character / 选择汉字
              </h2>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="rounded-full bg-gray-100 px-4 py-2 font-bold text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {characters.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectCharacter(itemIndex)}
                  className={`rounded-2xl border-2 p-4 text-left transition hover:border-red-400 hover:bg-orange-50 ${
                    itemIndex === characterIndex
                      ? "border-red-400 bg-red-50"
                      : "border-orange-100 bg-white"
                  }`}
                >
                  <div className="text-4xl font-black text-red-600">
                    {item.character}
                  </div>
                  <div className="mt-2 font-bold text-gray-900">
                    {item.pinyin}
                  </div>
                  <div className="text-sm text-gray-600">{item.meaning}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

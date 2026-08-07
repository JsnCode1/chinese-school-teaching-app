"use client";

import { useEffect, useRef, useState } from "react";
import type { CharacterItem } from "@/lib/types";

type Props = {
  characters: CharacterItem[];
};

export default function WriterQuiz({ characters }: Props) {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<string>("idle");
  const [outlineVisible, setOutlineVisible] = useState(true);
  const [characterVisible, setCharacterVisible] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<any>(null);
  const quizRunningRef = useRef(false);

  const current = characters?.[index];

  useEffect(() => {
    let mounted = true;
    if (!current) return;

    const load = async () => {
      const HanziWriterModule = await import("hanzi-writer");
      const HanziWriter =
        (HanziWriterModule as any).default ?? HanziWriterModule;

      const canvasSize = 360;

      if (!mounted) return;

      if (writerRef.current) {
        try {
          writerRef.current.setCharacter(current.character);
          setOutlineVisible(true);
          setCharacterVisible(false);
          return;
        } catch (e) {
          // recreate if setCharacter fails
        }
      }

      if (!targetRef.current) return;

      writerRef.current = HanziWriter.create(
        targetRef.current,
        current.character,
        {
          width: canvasSize,
          height: canvasSize,
          padding: 16,
          showCharacter: false,
          showOutline: true,
          strokeAnimationSpeed: 1,
          strokeFadeDuration: 250,
          showHintAfterMisses: 2,
        },
      );
    };

    load();

    return () => {
      mounted = false;
      if (writerRef.current?.cancelQuiz) {
        try {
          writerRef.current.cancelQuiz();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [current]);

  const startQuiz = async () => {
    const writer = writerRef.current;
    if (!writer) return;
    setStatus("running");
    quizRunningRef.current = true;

    try {
      setOutlineVisible(false);
      setCharacterVisible(false);

      await writer.quiz({
        showOutline: false,
        showCharacter: false,
        showHintAfterMisses: 2,
        highlightOnComplete: true,
      });

      setStatus("complete");
      quizRunningRef.current = false;
    } catch (e) {
      setStatus("idle");
      quizRunningRef.current = false;
    }
  };

  const cancel = () => {
    const writer = writerRef.current;
    if (writer && writer.cancelQuiz) {
      writer.cancelQuiz();
    }
    setStatus("idle");
    quizRunningRef.current = false;
  };

  const toggleCharacter = () => {
    const writer = writerRef.current;
    if (!writer) return;

    if (characterVisible) {
      writer.hideCharacter?.();
      setCharacterVisible(false);
    } else {
      writer.showCharacter?.();
      setCharacterVisible(true);
    }
  };

  const toggleOutline = () => {
    const writer = writerRef.current;
    if (!writer) return;

    if (outlineVisible) {
      writer.hideOutline?.();
      setOutlineVisible(false);
    } else {
      writer.showOutline?.();
      setOutlineVisible(true);
    }
  };

  const next = () => {
    setStatus("idle");
    setIndex((i) => (i + 1) % (characters?.length ?? 1));
  };

  const prev = () => {
    setStatus("idle");
    setIndex(
      (i) => (i - 1 + (characters?.length ?? 1)) % (characters?.length ?? 1),
    );
  };

  if (!characters || characters.length === 0) {
    return <p>No characters for this lesson.</p>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <div>
          <h2 className="text-4xl font-extrabold">Writer Quiz</h2>
          <p className="text-gray-600">
            Draw the character that matches the pinyin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Character</div>
                <div className="mt-2 text-6xl font-bold text-gray-800">
                  {current.character}
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Stroke count: {current.stroke_count ?? "—"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="mt-1 font-medium">
                  {index + 1} / {characters.length}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={startQuiz}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Start Quiz
                </button>
                <button
                  onClick={cancel}
                  className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={toggleCharacter}
                  className="rounded-lg bg-white border px-3 py-1"
                >
                  {characterVisible ? "Hide Character" : "Show Character"}
                </button>
                <button
                  onClick={toggleOutline}
                  className="rounded-lg bg-white border px-3 py-1"
                >
                  {outlineVisible ? "Hide Outline" : "Show Outline"}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  className="rounded-md bg-gray-100 px-3 py-1"
                >
                  Previous
                </button>
                <button
                  onClick={next}
                  className="rounded-md bg-gray-100 px-3 py-1"
                >
                  Next
                </button>

                <div className="ml-4 flex items-center gap-2">
                  <div className="text-sm text-gray-600">Status:</div>
                  <div className="font-medium">{status}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 flex items-center">
          <div className="w-full rounded-2xl bg-white p-6 shadow">
            <div className="mb-5 rounded-2xl bg-red-50 p-4 text-center shadow-sm">
              <div className="text-3xl font-semibold text-red-700">
                {current.pinyin}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {current.meaning}
              </div>
            </div>

            <div className="w-full flex items-center justify-center">
              <div className="w-[360px] h-[360px] flex items-center justify-center">
                <div
                  ref={targetRef}
                  id={`writer-target-${current.id}`}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

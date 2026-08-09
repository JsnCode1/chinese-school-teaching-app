"use client";

import { useEffect, useRef, useState } from "react";
import type { CharacterItem } from "@/lib/types";

type Props = {
  characters: CharacterItem[];
};

type QuizStatus = "idle" | "running" | "complete";

export default function WriterQuiz({ characters }: Props) {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<QuizStatus>("idle");
  const [outlineVisible, setOutlineVisible] = useState(true);
  const [characterVisible, setCharacterVisible] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const targetRef = useRef<SVGSVGElement | null>(null);
  const writerRef = useRef<any>(null);

  const current = characters?.[index];

  useEffect(() => {
    let mounted = true;

    if (!current) return;

    const loadWriter = async () => {
      const HanziWriterModule = await import("hanzi-writer");

      const HanziWriter =
        (HanziWriterModule as any).default ?? HanziWriterModule;

      if (!mounted || !targetRef.current) return;

      try {
        writerRef.current?.cancelQuiz?.();
      } catch {
        // Ignore.
      }

      if (writerRef.current) {
        try {
          await writerRef.current.setCharacter(current.character);

          writerRef.current.showOutline?.();
          writerRef.current.hideCharacter?.();

          setOutlineVisible(true);
          setCharacterVisible(false);
          setStatus("idle");

          return;
        } catch {
          // Recreate below if setCharacter fails.
        }
      }

      writerRef.current = HanziWriter.create(
        targetRef.current,
        current.character,
        {
          width: 360,
          height: 360,
          padding: 24,

          showCharacter: false,
          showOutline: true,

          strokeAnimationSpeed: 1,
          strokeFadeDuration: 250,
          showHintAfterMisses: 2,

          strokeColor: "#000000",
          outlineColor: "#fca5a5",
          highlightColor: "#c1fca5",
          drawingColor: "#000000",
        },
      );

      setOutlineVisible(true);
      setCharacterVisible(false);
      setStatus("idle");
    };

    loadWriter();

    return () => {
      mounted = false;

      try {
        writerRef.current?.cancelQuiz?.();
      } catch {
        // Ignore cleanup errors.
      }
    };
  }, [current]);

  const startQuiz = () => {
    const writer = writerRef.current;

    if (!writer) return;

    try {
      writer.cancelQuiz?.();
    } catch {
      // Ignore.
    }

    writer.hideCharacter?.();

    setCharacterVisible(false);
    setStatus("running");

    writer.quiz({
      showOutline: outlineVisible,
      showCharacter: false,
      showHintAfterMisses: 2,
      highlightOnComplete: true,

      onComplete: () => {
        setStatus("complete");
      },
    });
  };

  const cancelQuiz = () => {
    try {
      writerRef.current?.cancelQuiz?.();
    } catch {
      // Ignore.
    }

    setStatus("idle");
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
    cancelQuiz();

    setIndex((i) => (i + 1) % characters.length);
    setOutlineVisible(true);
    setCharacterVisible(false);
    setStatus("idle");
  };

  const prev = () => {
    cancelQuiz();

    setIndex((i) => (i - 1 + characters.length) % characters.length);
    setOutlineVisible(true);
    setCharacterVisible(false);
    setStatus("idle");
  };

  const selectCharacter = (selectedIndex: number) => {
    cancelQuiz();

    setIndex(selectedIndex);
    setOutlineVisible(true);
    setCharacterVisible(false);
    setPickerOpen(false);
  };

  if (!characters || characters.length === 0) {
    return (
      <div className="rounded-[2rem] border border-yellow-200 bg-yellow-50 p-10 text-center shadow-sm">
        <div className="text-6xl">📚</div>

        <h2 className="mt-4 text-xl font-black text-orange-700">
          Nothing to practice yet!
        </h2>

        <p className="mt-2 text-gray-600">
          There are no characters in this lesson.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-2rem)] rounded-[2rem] bg-gradient-to-br from-orange-50 via-yellow-50 to-sky-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto mb-7 max-w-6xl text-center">
          <div className="text-5xl sm:text-6xl">✏️</div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-orange-700 sm:text-4xl">
            写一写
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-base font-medium text-gray-600 sm:text-lg">
            读单词，记汉字，把它写下来！
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="mb-5 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-gray-500">进度条</span>

              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">
                {index + 1} / {characters.length}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-orange-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 transition-all duration-500"
                style={{
                  width: `${((index + 1) / characters.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-stretch">
            <div className="lg:col-span-2">
              <div className="flex h-full flex-col rounded-[2rem] border-4 border-white bg-white/95 p-5 shadow-xl sm:p-7">
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-orange-700">
                    这是什么字？
                  </span>
                </div>

                <div className="mt-5 rounded-[2rem] border-2 border-red-100 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6 text-center">
                  <div className="text-sm font-black uppercase tracking-[0.15em] text-red-400">
                    读这个单词
                  </div>

                  <div className="mt-3 text-5xl font-black text-red-600 sm:text-6xl">
                    {current.pinyin}
                  </div>

                  <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-200" />

                  <div className="mt-4 text-xl font-bold text-gray-700">
                    {current.meaning}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex gap-3">
                    <div className="text-2xl">💡</div>

                    <div>
                      <div className="font-black text-blue-800">
                        你能记住它吗？
                      </div>

                      <p className="mt-1 text-sm font-medium leading-relaxed text-blue-700/80">
                        先试着画出来。如果卡住了，使用指南或显示答案。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  {status === "idle" && (
                    <div className="rounded-2xl bg-slate-50 p-4 text-center font-bold text-gray-600">
                      随时准备就绪！
                    </div>
                  )}

                  {status === "running" && (
                    <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-4 text-center font-black text-blue-600">
                      继续——画出笔画!
                    </div>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={startQuiz}
                    className="col-span-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-5 py-4 text-lg font-black text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    ✏️ {status === "complete" ? "Try Again" : "开始画画"}
                  </button>

                  <button
                    type="button"
                    onClick={toggleOutline}
                    className="rounded-2xl border-2 border-purple-100 bg-purple-50 px-3 py-3 text-sm font-black text-purple-700 transition hover:bg-purple-100"
                  >
                    {outlineVisible
                      ? "隐藏答案 / Hide Answer"
                      : "显示答案 / Show Answer"}
                  </button>

                  <button
                    type="button"
                    onClick={toggleCharacter}
                    className="rounded-2xl border-2 border-sky-100 bg-sky-50 px-3 py-3 text-sm font-black text-sky-700 transition hover:bg-sky-100"
                  >
                    {characterVisible
                      ? "隐藏答案 / Hide Answer"
                      : "显示答案 / Show Answer"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="col-span-2 rounded-2xl border-2 border-yellow-200 bg-yellow-100 px-4 py-3 font-black text-orange-700 transition hover:bg-yellow-200"
                  >
                    🔤 换个词 / Pick Another Word
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={prev}
                    className="rounded-2xl bg-red-500 px-4 py-4 text-lg font-black text-white transition hover:bg-red-600"
                  >
                    ← 上一项
                  </button>

                  <button
                    type="button"
                    onClick={next}
                    className="rounded-2xl bg-green-500 px-4 py-4 text-lg font-black text-white transition hover:bg-green-600"
                  >
                    下一项 →
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="h-full rounded-[2rem] border-4 border-white bg-white/95 p-5 shadow-xl sm:p-7">
                <div className="text-center">
                  <div className="text-3xl">👇</div>

                  <h2 className="mt-1 text-2xl font-black text-slate-800 sm:text-3xl">
                    在框内画出来！
                  </h2>

                  <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">
                    使用你的手指、鼠标或笔
                  </p>
                </div>

                <div className="mt-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute -top-4 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-500 px-5 py-2 text-sm font-black text-white shadow-md">
                      ✏️ DRAW HERE
                    </div>

                    <div className="rounded-[2rem] bg-blue-100 p-2 shadow-lg">
                      <div className="overflow-hidden rounded-[1.5rem] border-[6px] border-blue-400 bg-white shadow-inner">
                        <svg
                          ref={targetRef}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 360 360"
                          width="360"
                          height="360"
                          className="block aspect-square h-auto w-[min(82vw,360px)] touch-none select-none bg-white"
                        >
                          <rect
                            x="0"
                            y="0"
                            width="360"
                            height="360"
                            fill="white"
                          />

                          <line
                            x1="0"
                            y1="0"
                            x2="360"
                            y2="360"
                            stroke="#dbeafe"
                            strokeWidth="2"
                            strokeDasharray="8 8"
                          />

                          <line
                            x1="360"
                            y1="0"
                            x2="0"
                            y2="360"
                            stroke="#dbeafe"
                            strokeWidth="2"
                            strokeDasharray="8 8"
                          />

                          <line
                            x1="180"
                            y1="0"
                            x2="180"
                            y2="360"
                            stroke="#bfdbfe"
                            strokeWidth="2"
                            strokeDasharray="10 8"
                          />

                          <line
                            x1="0"
                            y1="180"
                            x2="360"
                            y2="180"
                            stroke="#bfdbfe"
                            strokeWidth="2"
                            strokeDasharray="10 8"
                          />

                          <rect
                            x="8"
                            y="8"
                            width="344"
                            height="344"
                            rx="18"
                            fill="none"
                            stroke="#dbeafe"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {status === "running" && (
                  <div className="mt-5 text-center">
                    <button
                      type="button"
                      onClick={cancelQuiz}
                      className="rounded-xl px-4 py-2 text-sm font-bold text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                      ↻ 重新开始
                    </button>
                  </div>
                )}

                <div className="mt-5 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                    ✍️{" "}
                    {current.stroke_count != null
                      ? `${current.stroke_count} strokes`
                      : "Stroke count unavailable"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-4xl">🔤</div>

                <h2 className="mt-2 text-2xl font-black text-orange-700 sm:text-3xl">
                  选择一个单词
                </h2>

                <p className="mt-1 font-medium text-gray-500">
                  哪个词你想练习？
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Close character picker"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-600 transition hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {characters.map((item, itemIndex) => {
                const selected = itemIndex === index;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => selectCharacter(itemIndex)}
                    className={`rounded-3xl border-2 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                      selected
                        ? "border-orange-400 bg-orange-100 ring-2 ring-orange-200"
                        : "border-orange-100 bg-orange-50 hover:bg-orange-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-5xl font-black text-red-600">
                        {item.character}
                      </div>

                      {selected && (
                        <div className="rounded-full bg-orange-500 px-2 py-1 text-xs font-black text-white">
                          Current
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-xl font-black text-orange-800">
                      {item.pinyin}
                    </div>

                    <div className="mt-1 font-medium text-gray-600">
                      {item.meaning}
                    </div>

                    {item.stroke_count != null && (
                      <div className="mt-3 text-xs font-bold text-gray-400">
                        ✍️ {item.stroke_count} strokes
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

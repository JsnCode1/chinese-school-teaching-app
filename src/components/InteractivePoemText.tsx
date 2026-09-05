"use client";
// Change block w-fit to inline-block for xxx,xxx structure rather than row row structure.
import { useEffect, useState } from "react";

type Props = {
  chineseText: string;
  pinyin: string | null;
};

function stopReading() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function speakChinese(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);

  const voices = window.speechSynthesis.getVoices();

  const preferredVoice =
    voices.find(
      (voice) =>
        voice.name.includes("Xiaoxiao") || voice.name.includes("Tingting"),
    ) || voices.find((voice) => voice.lang === "zh-CN");

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.lang = "zh-CN";
  utterance.rate = 0.67;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function InteractivePoemText({ chineseText, pinyin }: Props) {
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [compactRows, setCompactRows] = useState(false);
  const chineseLines = chineseText.split("\n").filter(Boolean);
  const pinyinLines = pinyin?.split("\n").filter(Boolean) ?? [];

  useEffect(() => {
    return () => {
      stopReading();
    };
  }, []);

  // Combine all valid lines back together with line breaks for natural reading pauses
  const fullPoemText = chineseLines.join("\n");

  return (
    <div className="flex flex-col gap-6">
      {/* Global Play and Stop Audio Controls */}
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => speakChinese(fullPoemText)}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-red-700 active:scale-95"
        >
          读全诗
        </button>

        <button
          type="button"
          onClick={stopReading}
          className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
        >
          停止朗读
        </button>

        <button
          type="button"
          onClick={() => setCompactRows((current) => !current)}
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-semibold text-red-700 shadow-sm transition hover:bg-red-100 active:scale-95"
        >
          {compactRows ? "恢复行距" : "缩小行距"}
        </button>
      </div>

      {/* Poem Lines Layout */}
      <div
        className={
          compactRows ? "space-y-0 text-center" : "space-y-6 text-center"
        }
      >
        {chineseLines.map((line, lineIndex) => {
          const chars = line.split("");
          const pinyinWords = pinyinLines[lineIndex]?.split(" ") ?? [];
          let pinyinIndex = 0;

          const isActive = activeLineIndex === lineIndex;

          return (
            <button
              key={lineIndex}
              type="button"
              onMouseEnter={() => setActiveLineIndex(lineIndex)}
              onMouseLeave={() => setActiveLineIndex(null)}
              onFocus={() => setActiveLineIndex(lineIndex)}
              onBlur={() => setActiveLineIndex(null)}
              onClick={() => {
                setActiveLineIndex(lineIndex);
                speakChinese(line);
              }}
              // Change block w-fit to inline-block for xxx,xxx structure rather than row row structure.
              className="mx-auto block w-fit max-w-full rounded-2xl p-3 text-center transition"
            >
              <div className="inline-flex flex-wrap justify-center gap-4 rounded-xl px-2 py-1">
                {chars.map((char, charIndex) => {
                  const isPunctuation = "，。！？；：,.!?;:（）() ".includes(
                    char,
                  );

                  if (isPunctuation) {
                    return (
                      <span
                        key={charIndex}
                        className="self-end text-4xl font-bold text-gray-900"
                      >
                        {char}
                      </span>
                    );
                  }

                  const charPinyin = pinyinWords[pinyinIndex++] ?? "";

                  return (
                    <span
                      key={charIndex}
                      className="flex flex-col items-center"
                    >
                      <span className="text-base font-medium text-red-600">
                        {charPinyin}
                      </span>

                      <span
                        className={`text-4xl font-bold text-gray-900 transition-colors ${
                          isActive
                            ? "underline decoration-red-500 decoration-4 underline-offset-8"
                            : ""
                        }`}
                      >
                        {char}
                      </span>
                    </span>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  chineseText: string;
  pinyin: string | null;
};

function splitChineseIntoSentences(text: string) {
  return text.match(/[^。！？!?]+[。！？!?]?/g) ?? [];
}

export default function InteractiveStoryText({ chineseText, pinyin }: Props) {
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(
    null,
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Keep a mutable reference to the utterance to prevent Chrome garbage collection
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load and cache voices across all browsers safely
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Only update state if voices are actually loaded
      if (allVoices.length > 0) {
        setVoices(allVoices);
      }
    };

    // Chrome and Safari often need onvoiceschanged, but we call it immediately too
    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  function speakChinese(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Cancel any ongoing speech explicitly before building the next one
    window.speechSynthesis.cancel();

    // Assign utterance to the ref object so JavaScript holds it in memory
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.lang = "zh-CN";
    utteranceRef.current.rate = 0.67;

    // Use current voices state, or look up directly from the window object if state is empty
    const availableVoices =
      voices.length > 0 ? voices : window.speechSynthesis.getVoices();

    const preferredVoice =
      availableVoices.find(
        (v) =>
          v.name.includes("Xiaoxiao") ||
          v.name.includes("Meijia") ||
          v.name.includes("Yaoyao"),
      ) ||
      availableVoices.find(
        (v) =>
          v.name.includes("Tingting") ||
          v.name.includes("Google 普通话") ||
          v.name.includes("Google 國語") ||
          v.name.includes("Huihui"),
      ) ||
      availableVoices.find((v) => v.lang === "zh-CN") ||
      availableVoices.find((v) => v.lang.startsWith("zh-"));

    if (preferredVoice) {
      utteranceRef.current.voice = preferredVoice;
    }

    // Clean up reference memory once speaking concludes or errors out
    utteranceRef.current.onend = () => {
      utteranceRef.current = null;
    };
    utteranceRef.current.onerror = () => {
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utteranceRef.current);
  }

  const chineseSentences = splitChineseIntoSentences(chineseText);

  // Combine all sentences together to create the full story text
  const fullStoryText = chineseSentences.join("");

  const pinyinWords = pinyin?.split(" ") ?? [];
  let pinyinIndex = 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Read Entire Story Button */}
      <div className="flex gap-2">
        <button
          onClick={() => speakChinese(fullStoryText)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-red-700 active:scale-95"
        >
          读全课文
        </button>

        <button
          onClick={() => window.speechSynthesis?.cancel()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
        >
          停止朗读
        </button>
      </div>

      <p className="text-left leading-relaxed">
        {chineseSentences.map((sentence, sentenceIndex) => {
          const chars = sentence.split("");
          const isActive = activeSentenceIndex === sentenceIndex;

          return (
            <span
              key={sentenceIndex}
              onMouseEnter={() => setActiveSentenceIndex(sentenceIndex)}
              onMouseLeave={() => setActiveSentenceIndex(null)}
              onClick={() => speakChinese(sentence)}
              className={`cursor-pointer rounded-md transition ${isActive ? "bg-red-50" : ""}`}
            >
              {chars.map((char, charIndex) => {
                const isPunctuation = "，。！？；：,.!?;:（）() ".includes(
                  char,
                );

                if (isPunctuation) {
                  return (
                    <span
                      key={`${sentenceIndex}-${charIndex}`}
                      className="mb-4 inline-flex flex-col items-center align-bottom"
                    >
                      <span className="text-sm font-medium leading-none select-none opacity-0">
                        &nbsp;
                      </span>
                      <span className="text-3xl font-bold leading-tight text-gray-900">
                        {char}
                      </span>
                    </span>
                  );
                }

                const charPinyin = pinyinWords[pinyinIndex++] ?? "";

                return (
                  <span
                    key={`${sentenceIndex}-${charIndex}`}
                    className="mb-4 inline-flex flex-col items-center align-bottom"
                  >
                    <span className="text-sm font-medium leading-none text-red-600">
                      {charPinyin}
                    </span>
                    <span
                      className={`text-3xl font-bold leading-tight text-gray-900 ${
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
            </span>
          );
        })}
      </p>
    </div>
  );
}

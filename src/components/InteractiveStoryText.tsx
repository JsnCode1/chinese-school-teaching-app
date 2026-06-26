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
  const pinyinWords = pinyin?.split(" ") ?? [];
  let pinyinIndex = 0;

  return (
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
              const isPunctuation = "，。！？；：,.!?;:（）() ".includes(char);

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
  );
}

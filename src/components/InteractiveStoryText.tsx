"use client";

import { useState, useEffect } from "react";

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

  // load and cache voices asynchronously across all browsers
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  //Pass cached voices into the speech generator
  function speakChinese(text: string) {
    if (typeof window === "undefined") return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";

    utterance.rate = 0.85;

    // Find authentic native Chinese voices from the cached state array
    const preferredVoice =
      // Look for modern natural AI/Neural voices first
      voices.find(
        (v) =>
          v.name.includes("Xiaoxiao") ||
          v.name.includes("Meijia") ||
          v.name.includes("Yaoyao"),
      ) ||
      // Look for reliable premium native platform voices
      voices.find(
        (v) =>
          v.name.includes("Tingting") ||
          v.name.includes("Google 普通话") ||
          v.name.includes("Google 國語") ||
          v.name.includes("Huihui"),
      ) ||
      // Fallback to any general mainland Chinese engine
      voices.find((v) => v.lang === "zh-CN") ||
      // Universal fallback to any Chinese language tag variant (zh-TW, zh-SG, zh-HK)
      voices.find((v) => v.lang.startsWith("zh-"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
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
                    className="text-3xl font-bold text-gray-900"
                  >
                    {char}
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
